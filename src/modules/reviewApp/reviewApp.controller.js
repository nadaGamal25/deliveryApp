import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"
import { Review } from "../../../database/models/review.model.js"
import { User } from "../../../database/models/user.model.js"
import { ReviewApp } from "../../../database/models/reviewApp.model.js"

const addReview=catchError(async(req,res,next)=>{
    req.body.user=req.user._id
    let isExist=await ReviewApp.findOne({user:req.user._id})
    if(isExist) return next(new AppError("لقد قمت بتقييم التطبيق من قبل",409))
    let review=new ReviewApp(req.body)
    await review.save()
    res.status(200).json({message:"تمت اضافة التقييم",status:200,data:{review}})
})
 
const updateReview=catchError(async(req,res,next)=>{
    req.body.user=req.user._id
    let review=await ReviewApp.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    review || next(new AppError("لا يوجد تقييم",404))
    !review || res.status(200).json({message:"تم تعديل التقييم",status:200,data:{review}})
})

const deleteReview=catchError(async(req,res,next)=>{
    let review=await ReviewApp.findOneAndDelete({_id:req.params.id})
    review || next(new AppError("لا يوجد تقييم",404))
    !review || res.status(200).json({message:"تم حذف تقييمك",status:200,data:[]})
})

const allReviews=catchError(async(req,res,next)=>{
    let review=await ReviewApp.find().populate('user','name phone profileImg')
    res.status(200).json({message:"success",status:200,data:{review}})
})



export{
    addReview,allReviews,updateReview,deleteReview
}