import {Offer} from '../../../database/models/offer.model.js'
import { Order } from '../../../database/models/order.model.js'
import { User } from '../../../database/models/user.model.js'
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add offer
const addOffer=catchError(async(req,res,next)=>{
    if (req.user.isValid === false)
        return next(new AppError('يجب دفع اشتراك التطبيق لتتمكن من تقديم عروض..تواصل مع الادمن', 400));
  let offer=new Offer(req.body)
    await offer.save()
    res.status(200).json({message:"تمت اضافة عرضك بجاح فى انتظار موافقة العميل", status:200,data:{offer}})
})


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
    // const populatedOffers = await Offer.populate(offers, {
    //     path: 'driverId',
    //     populate: [
    //         { path: 'categoryId', select: 'name', strictPopulate: false },
    //         { path: 'village', select: 'name', strictPopulate: false },
    //         { path: 'position', select: 'name', strictPopulate: false }
    //     ]
    // });

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
            data: { offers }
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

//change offer status
// const changeOfferStatus = catchError(async (req, res, next) => {
//     let offer = await Offer.findById(req.params.id);
    
//     if (!offer) {
//         return next(new AppError("هذا العرض غير موجود", 404));
//     }

//     // Change the offer status based on the request body
//     if (req.body.status === 'deleted') {
//         offer.status = 'deleted';
//         await offer.save();  // Save the offer instance
//         res.status(200).json({ message: "تم تجاهل هذا العرض", status:200,data:[] });

//     } else if (req.body.status === 'accepted') {
//         offer.status = 'accepted';
//         await offer.save();  // Save the offer instance

//         // Increment the number of connects for the user
//         await User.findByIdAndUpdate(
//             { _id: offer.driverId },
//             { $inc: { numberOfConnect: 1 } }
//         );

//         // Update the related order with status and driverId
//         await Order.findByIdAndUpdate(
//             { _id: offer.orderId },
//             { $set: { status: 'current', driverId: offer.driverId } }
//         );

//         res.status(200).json({ message: "تم قبول هذا العرض", status:200,data:[] });
//     } else {
//         return next(new AppError("حدث خطأ ما", 404));
//     }
// });

const changeOfferStatus = catchError(async (req, res, next) => {
    // Find the offer by ID
    let offer = await Offer.findById(req.params.id);
    
    if (!offer) {
        return next(new AppError("هذا العرض غير موجود", 404));
    }

    if (req.body.status === 'deleted') {
        // Update the status of the selected offer to 'deleted'
        offer.status = 'deleted';
        await offer.save();

        await User.findByIdAndUpdate(
            { _id: offer.driverId },
            { $inc: { numberOfConnect: -1 } }
        );

        // Update the related order with status and driverId
        await Order.findByIdAndUpdate(
            { _id: offer.orderId },
            { $set: { status: 'waiting' }, $unset: { driverId: "" } }
        );

        // Update offers with status 'ignored' in the same order to 'waiting'
        await Offer.updateMany(
            { orderId: offer.orderId, status: 'ignored' },
            { $set: { status: 'waiting' } }
        );

        res.status(200).json({ message: "تم تجاهل هذا العرض", status: 200, data: [] });
    } else if (req.body.status === 'accepted') {
        // Update the status of the selected offer to 'accepted'
        offer.status = 'accepted';
        await offer.save();

        // Increment the number of connects for the user
        await User.findByIdAndUpdate(
            { _id: offer.driverId },
            { $inc: { numberOfConnect: 1 } }
        );

        // Update the related order with status and driverId
        await Order.findByIdAndUpdate(
            { _id: offer.orderId },
            { $set: { driverId: offer.driverId } }
        );

        // Update other offers with status 'waiting' in the same order to 'ignored'
        await Offer.updateMany(
            { orderId: offer.orderId, status: 'waiting', _id: { $ne: req.params.id } },
            { $set: { status: 'ignored' } }
        );

        res.status(200).json({ message: "تم قبول هذا العرض", status: 200, data: [] });
    } else {
        return next(new AppError("حدث خطأ ما", 404));
    }
});





export{
    addOffer,deleteOffer,getOffersByOrderId,getOffersByUserId,getOffersForUser,changeOfferStatus
}