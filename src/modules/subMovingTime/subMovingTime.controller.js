import { SubMovingTime } from "../../../database/models/subMovingTime.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSubMovingTime=catchError(async(req,res,next)=>{
    let subMovingTime=new SubMovingTime(req.body)
    await subMovingTime.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{subMovingTime}})
})
  
const updateSubMovingTime=catchError(async(req,res,next)=>{
    let subMovingTime=await SubMovingTime.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    subMovingTime || next(new AppError("لا يوجد ",404))
    !subMovingTime || res.status(200).json({message:"تم التعديل ",status:200,data:{subMovingTime}})
})

const deleteSubMovingTime=catchError(async(req,res,next)=>{
    let subMovingTime=await SubMovingTime.findOneAndDelete({_id:req.params.id})
    subMovingTime || next(new AppError("لا يوجد ",404))
    !subMovingTime || res.status(200).json({message:"تم الحذف ",status:200,data:[]})
})

const getSubMovingTime=catchError(async(req,res,next)=>{
    let subMovingTime=await SubMovingTime.find()
    res.status(200).json({message:"success",status:200,data:{subMovingTime}})
})



export{
    addSubMovingTime,updateSubMovingTime,deleteSubMovingTime,getSubMovingTime
}