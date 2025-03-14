import { Notification } from '../../../database/models/notification.model.js'
import {Offer} from '../../../database/models/offer.model.js'
import { Order } from '../../../database/models/order.model.js'
import { User } from '../../../database/models/user.model.js'
import { sendNotification, validateFCMToken } from '../../../public/js/firebase.js'
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add offer
const addOffer = catchError(async (req, res, next) => {
    let title="عرض جديد على طلبك";
    let body="تم إضافة عرض جديد على طلبك من قبل "+req.user.name;
    const from=req.user._id
    const order=req.body.orderId
    let theOrder = await Order.findById(req.body.orderId);
    let client = await User.findById(theOrder.clientId)
    // Ensure the driver has a valid subscription before allowing them to make an offer
    if (!req.user.isValid) {
        return next(new AppError('يجب دفع اشتراك التطبيق لتتمكن من تقديم عروض..تواصل مع الادمن', 400));
    }

    // Check if an offer already exists for this driver on the same order
    let existingOffer = await Offer.findOne({ orderId: req.body.orderId, driverId: req.body.driverId });

    if (existingOffer) {
        if(existingOffer.status === "deleted"){
            existingOffer.price = req.body.price;
            existingOffer.status = "waiting";
            await existingOffer.save();

            const sent = await sendNotification(client.fcmToken, title, body);
    if (sent) {
        await Notification.create({ userId: client._id, title, body ,from ,order });
    }
            return res.status(200).json({
                message: "تم اضافة عرضك مرة اخرى في انتظار موافقة العميل",
                status: 200,
                data: { offer: existingOffer },
            });
        }else{
            // If the offer exists, update the price and return success message
        existingOffer.price = req.body.price;
        await existingOffer.save();

        return res.status(200).json({
            message: "تم تحديث عرضك في انتظار موافقة العميل",
            status: 200,
            data: { offer: existingOffer },
        });
        }
        
    }

    // If no existing offer, create a new one
    let newOffer = new Offer(req.body);
    await newOffer.save();

    const sent = await sendNotification(client.fcmToken, title, body);
    if (sent) {
        await Notification.create({ userId: client._id, title, body ,from ,order });
    }

    res.status(200).json({
        message: "تمت إضافة عرضك بنجاح في انتظار موافقة العميل",
        status: 200,
        data: { offer: newOffer },
    });
});



// delete offer
const deleteOffer = catchError(async (req, res, next) => {
    let offer = await Offer.findById(req.params.id);
    if (!offer) {
        return next(new AppError("العرض غير موجودة", 404));
    }
    await Offer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم الحذف بنجاح" , status:200,data:[] });
});

//get offers by order id
const getOffersByOrderId = catchError(async (req, res, next) => {
    // Fetch offers related to the order
    let offers = await Offer.find({ orderId: req.params.id });

    // Filter out offers with a status of "ignored"
    offers = offers.filter(offer => offer.status !== "deleted" && offer.status !== "ignored");

    // Populate driverId and its related fields for remaining offers
    const populatedOffers = await Offer.populate(offers, {
        path: 'driverId',
        populate: [
            { path: 'categoryId', select: 'name', strictPopulate: false },
            { path: '', select: 'name', strictPopulate: false },
            { path: 'position', select: 'name', strictPopulate: false }
        ]
    });

    // Return the response
    if (offers.length === 0) {
        return res.status(200).json({
            message: 'لا توجد عروض متاحة',
            status: 200,
            data: { offers: [] }
        });
    } else {
        res.status(200).json({
            message: 'success',
            status: 200,
            data: { offers: populatedOffers }
        });
    }
});


//get offers by user id for admin
const getOffersByUserId = catchError(async (req, res) => {
    // Construct the query dynamically
    const query = { driverId: req.params.id };
    if (req.query.status) {
        query.status = req.query.status;
    }

    // Find offers based on the query
    const offers = await Offer.find(query);

    if (offers.length === 0) {
        return res.status(200).json({
            message: 'لا توجد عروض',
            status: 200,
            data: { offers: [] }
        });
    }

    res.status(200).json({
        message: 'success',
        status: 200,
        data: { offers }
    });
}); 


//get offers for user
const getOffersForUser=catchError(async(req,res)=>{
    let offers = await Offer.find({driverId:req.user._id}).populate('orderId')
    if (offers.length === 0) {
        return res.status(200).json({
            message: 'لا توجد عروض',
            status: 200,
            data: { offers: [] }
        });
    }
    res.status(200).json({message:'success', status:200,data:{offers}})   
})

const changeOfferStatus = catchError(async (req, res, next) => {
    // console.log("Request received with status:", req.body.status);
    
    let offer = await Offer.findById(req.params.id);
    if (!offer) {
        return next(new AppError("هذا العرض غير موجود", 404));
    }
    
    let driver = await User.findById(offer.driverId);
    if (!driver) {
        return next(new AppError("السائق غير موجود", 404));
    }
    
    if (!driver.fcmToken) {
        return next(new AppError("لا يمكن ارسال اشعار لهذا السائق", 400));
    }
    
    const isValid = await validateFCMToken(driver.fcmToken);
    if (!isValid) {
        return res.status(400).json({ message: "Invalid FCM token", status: 400, data: [] });
    }
    
    let title, body;
    const from=req.user._id
    const order=offer.orderId
    if (req.body.status === "deleted") {
        offer.status = "deleted";
        await offer.save();
        
        await Order.findByIdAndUpdate(offer.orderId, { status: "waiting", $set: { driverId: null } });
        await Offer.updateMany({ orderId: offer.orderId, status: "ignored" }, { status: "waiting" });

        title = "تم رفض عرضك";
        body = "تم رفض العرض من قبل العميل..ربما عليك تخفيض السعر";
    } else if (req.body.status === "accepted") {
        offer.status = "accepted";
        await offer.save();

        await Order.findByIdAndUpdate(offer.orderId, { driverId: offer.driverId, price: offer.price });
        await Offer.updateMany({ orderId: offer.orderId, status: "waiting", _id: { $ne: req.params.id } }, { status: "ignored" });

        title = "تم قبول عرضك";
        body = "تم قبول العرض من قبل العميل.";
    } else {
        console.log("Invalid status provided");
        return next(new AppError("حدث خطأ ما", 400));
    }

    const sent = await sendNotification(driver.fcmToken, title, body);
    if (sent) {
        await Notification.create({ userId: driver._id, title, body ,from ,order });
    }

    res.status(200).json({ message: `تم ${req.body.status === "deleted" ? "رفض" : "قبول"} هذا العرض`, status: 200 });
});



// const changeOfferStatus = catchError(async (req, res, next) => {
//     // Find the offer by ID
//     let offer = await Offer.findById(req.params.id);
    
//     if (!offer) {
//         return next(new AppError("هذا العرض غير موجود", 404));
//     }

//     if (req.body.status === 'deleted') {
//         // Update the status of the selected offer to 'deleted'
//         offer.status = 'deleted';
//         await offer.save();

//         // Update the related order with status and driverId
//         await Order.findByIdAndUpdate(
//             { _id: offer.orderId },
//             { $set: { status: 'waiting' }, $set: { driverId: null } }
//         );

//         // Update offers with status 'ignored' in the same order to 'waiting'
//         await Offer.updateMany(
//             { orderId: offer.orderId, status: 'ignored' },
//             { $set: { status: 'waiting' } }
//         );

//         res.status(200).json({ message: "تم تجاهل هذا العرض", status: 200, data: [] });
//     } else if (req.body.status === 'accepted') {
//         // Update the status of the selected offer to 'accepted'
//         offer.status = 'accepted';
//         await offer.save();

//         // Update the related order with status and driverId
//         await Order.findByIdAndUpdate(
//             { _id: offer.orderId },
//             { $set: { driverId: offer.driverId, price:offer.price } }
//         );

//         // Update other offers with status 'waiting' in the same order to 'ignored'
//         await Offer.updateMany(
//             { orderId: offer.orderId, status: 'waiting', _id: { $ne: req.params.id } },
//             { $set: { status: 'ignored' } }
//         );

//         res.status(200).json({ message: "تم قبول هذا العرض", status: 200, data: [] });
//     } else {
//         return next(new AppError("حدث خطأ ما", 404));
//     }
// });





export{
    addOffer,deleteOffer,getOffersByOrderId,getOffersByUserId,getOffersForUser,changeOfferStatus
}