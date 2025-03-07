import { SubReturnTime } from "../../../database/models/subReturnTime.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSubReturnTime=catchError(async(req,res,next)=>{
    let subReturnTime=new SubReturnTime(req.body)
    await subReturnTime.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{subReturnTime}})
})
  
const updateSubReturnTime=catchError(async(req,res,next)=>{
    let subReturnTime=await SubReturnTime.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    subReturnTime || next(new AppError("لا يوجد ",404))
    !subReturnTime || res.status(200).json({message:"تم التعديل ",status:200,data:{subReturnTime}})
})

const deleteSubReturnTime=catchError(async(req,res,next)=>{
    let subReturnTime=await SubReturnTime.findOneAndDelete({_id:req.params.id})
    subReturnTime || next(new AppError("لا يوجد ",404))
    !subReturnTime || res.status(200).json({message:"تم الحذف ",status:200,data:[]})
})

const getSubReturnTime=catchError(async(req,res,next)=>{
    let subReturnTime=await SubReturnTime.find()
    res.status(200).json({message:"success",status:200,data:{subReturnTime}})
})



export{
    addSubReturnTime,updateSubReturnTime,deleteSubReturnTime,getSubReturnTime
}