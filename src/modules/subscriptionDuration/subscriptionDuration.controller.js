import { SubscriptionDuration } from "../../../database/models/subscriptionDuration.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSubDuration=catchError(async(req,res,next)=>{
    let subDuration=new SubscriptionDuration(req.body)
    await subDuration.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{subDuration}})
})
  
const updateSubDuration=catchError(async(req,res,next)=>{
    let subDuration=await SubscriptionDuration.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    subDuration || next(new AppError("لا يوجد ",404))
    !subDuration || res.status(200).json({message:"تم التعديل ",status:200,data:{subDuration}})
})

const deleteSubDuration=catchError(async(req,res,next)=>{
    let subDuration=await SubscriptionDuration.findOneAndDelete({_id:req.params.id})
    subDuration || next(new AppError("لا يوجد ",404))
    !subDuration || res.status(200).json({message:"تم الحذف ",status:200,data:[]})
})

const getSubDuration=catchError(async(req,res,next)=>{
    let subDuration=await SubscriptionDuration.find()
    res.status(200).json({message:"success",status:200,data:{subDuration}})
})



export{
    addSubDuration,updateSubDuration,deleteSubDuration,getSubDuration
}