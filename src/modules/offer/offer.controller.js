import {Offer} from '../../../database/models/offer.model.js'
import { Order } from '../../../database/models/order.model.js'
import { User } from '../../../database/models/user.model.js'
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add offer
const addOffer=catchError(async(req,res,next)=>{
  let offer=new Offer(req.body)
    await offer.save()
    res.status(200).json({message:"تمت اضافة عرضك بنجاح",offer})
})


// delete offer 
const deleteOffer = catchError(async (req, res, next) => {
    let offer = await Offer.findById(req.params.id);
    if (!offer) {
        return next(new AppError("العرض غير موجودة", 404));
    }
    await Offer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم الحذف بنجاح" });
});

//get offers by order id
const getOffersByOrderId=catchError(async(req,res)=>{
    let offers = await Offer.find({orderId:req.params.id}).populate('userId')
    if (!offers) {
        return next(new AppError('لا يوجد عروض', 404));
    }
    res.status(200).json({message:'success',offers})   
})

//get offers by user id for admin
const getOffersByUserId=catchError(async(req,res)=>{
    let offers = await Offer.find({userId:req.params.id});
    if (!offers) {
        return next(new AppError('لا يوجد عروض', 404));
    }
    res.status(200).json({message:'success',offers})   
})

//get offers for user
const getOffersForUser=catchError(async(req,res)=>{
    let offers = await Offer.find({userId:req.user._id}).populate('orderId')
    if (!offers) {
        return next(new AppError('لا يوجد عروض', 404));
    }
    res.status(200).json({message:'success',offers})   
})

//change offer status
const changeOfferStatus = catchError(async (req, res, next) => {
    let offer = await Offer.findById(req.params.id);
    
    if (!offer) {
        return next(new AppError("هذا العرض غير موجود", 404));
    }

    // Change the offer status based on the request body
    if (req.body.status === 'ignored') {
        offer.status = 'ignored';
        await offer.save();  // Save the offer instance
        res.status(200).json({ message: "تم تجاهل هذا العرض" });

    } else if (req.body.status === 'accepted') {
        offer.status = 'accepted';
        await offer.save();  // Save the offer instance

        // Increment the number of connects for the user
        await User.findByIdAndUpdate(
            { _id: offer.userId },
            { $inc: { numberOfConnect: 1 } }
        );

        // Update the related order with status and driverId
        await Order.findByIdAndUpdate(
            { _id: offer.orderId },
            { $set: { status: 'picked', driverId: offer.userId } }
        );

        res.status(200).json({ message: "تم قبول هذا العرض" });
    } else {
        return next(new AppError("حدث خطأ ما", 404));
    }
});

// const changeOfferStatus = catchError(async (req, res, next) => {
//     let offer = await Offer.findById(req.params.id);
    
//     if (!offer) {
//         return next(new AppError("هذا العرض غير موجود", 404));
//     } else if (req.body.status === 'ignored') {
//         offer.status = 'ignored';
//         await Offer.save();  
//         res.status(400).json({ message: "تم تجاهل هذا العرض " });
//     }  else if (req.body.status === 'accepted') {
//         offer.status = 'accepted';
//         await Offer.save();  

//         await User.findByIdAndUpdate(
//             { _id: offer.userId },
//             { $inc: { numberOfConnect: 1 } } 
//         );
//         await Order.findByIdAndUpdate(
//             { _id: offer.orderId },
//              { $set: { status: 'picked' , driverId: offer.userId} } 
//         );
//         res.status(200).json({ message: "تم قبول هذا العرض" });
//     } else {
//         return next(new AppError("حدث خطأ ما", 404));
//     }
// });




export{
    addOffer,deleteOffer,getOffersByOrderId,getOffersByUserId,getOffersForUser,changeOfferStatus
}