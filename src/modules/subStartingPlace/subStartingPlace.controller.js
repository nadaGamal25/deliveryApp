import { SubStartingPlace } from "../../../database/models/subStartingPlace.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSubStartingPlace=catchError(async(req,res,next)=>{
    let subStartingPlace=new SubStartingPlace(req.body)
    await subStartingPlace.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{subStartingPlace}})
})

const deleteSubStartingPlace=catchError(async(req,res,next)=>{
    let subStartingPlace=await SubStartingPlace.findOneAndDelete({_id:req.params.id})
    subStartingPlace || next(new AppError("لا يوجد ",404))
    !subStartingPlace || res.status(200).json({message:"تم الحذف ",status:200,data:[]})
})

const getSubStartingPlace=catchError(async(req,res,next)=>{
    let subStartingPlace=await SubStartingPlace.find()
    res.status(200).json({message:"success",status:200,data:{subStartingPlace}})
})



export{
    addSubStartingPlace,deleteSubStartingPlace,getSubStartingPlace
}