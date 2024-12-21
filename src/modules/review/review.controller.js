import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"
import { Review } from "../../../database/models/review.model.js"
import { User } from "../../../database/models/user.model.js"

const addReview=catchError(async(req,res,next)=>{
    req.body.client=req.user._id
    let isExist=await Review.findOne({client:req.user._id, driver:req.body.driver})
    if(isExist) return next(new AppError("لقد قمت بتقييم هذا السائق من قبل",409))
    let review=new Review(req.body)
    await review.save()
    res.status(200).json({message:"تمت اضافة التقييم",status:200,data:{review}})
})
 
const updateReview=catchError(async(req,res,next)=>{
    req.body.client=req.user._id
    let review=await Review.findOneAndUpdate({_id:req.params.id,client:req.user._id},req.body,{new:true})
    review || next(new AppError("لا يوجد تقييم",404))
    !review || res.status(200).json({message:"تم تعديل التقييم",status:200,data:{review}})
})

const deleteReview=catchError(async(req,res,next)=>{
    let review=await Review.findOneAndDelete({_id:req.params.id})
    review || next(new AppError("لا يوجد تقييم",404))
    !review || res.status(200).json({message:"تم حذف تقييمك",status:200,data:[]})
})

const allReviews=catchError(async(req,res,next)=>{
    let review=await Review.find().populate('client').populate('driver')
    res.status(200).json({message:"success",status:200,data:{review}})
})

const getReviewDriver=catchError(async(req,res,next)=>{
    let review=await Review.find({driver:req.params.id})
    if (review.length === 0) {
        return res.status(200).json({
            message: 'لا يوجد سائقين ',
            status: 200,
            data: { review: [] }
        });
    }
    !review || res.status(200).json({message:"success",status:200,data:{review}})
})

const getReviewClient = catchError(async (req, res, next) => {
    let review = await Review.find({ client: req.params.id }).populate({
        path: 'driver',
        select: 'name' 
    });

    if (review.length === 0) {
        return res.status(200).json({
            message: 'لا يوجد سائقين ',
            status: 200,
            data: { review: [] }
        });
    }

    // Remove the `client` field from the review before sending the response
    review = review.toObject();
    delete review.client;

    res.status(200).json({ message: "success", status: 200, data: { review } });
});


export{
    addReview,allReviews,getReviewDriver,updateReview,deleteReview,getReviewClient
}