import { SubGoPlace } from "../../../database/models/subGoPlace.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSubGoPlace=catchError(async(req,res,next)=>{
    let subGoPlace=new SubGoPlace(req.body)
    await subGoPlace.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{subGoPlace}})
})

const deleteSubGoPlace=catchError(async(req,res,next)=>{
    let subGoPlace=await SubGoPlace.findOneAndDelete({_id:req.params.id})
    subGoPlace || next(new AppError("لا يوجد ",404))
    !subGoPlace || res.status(200).json({message:"تم الحذف ",status:200,data:[]})
})

const getSubGoPlace=catchError(async(req,res,next)=>{
    let subGoPlace=await SubGoPlace.find()
    res.status(200).json({message:"success",status:200,data:{subGoPlace}})
})



export{
    addSubGoPlace,deleteSubGoPlace,getSubGoPlace
}