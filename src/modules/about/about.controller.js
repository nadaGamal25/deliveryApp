import { About } from "../../../database/models/aboutus.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addTxt=catchError(async(req,res,next)=>{
    let txt=new About(req.body)
    await txt.save()
    res.status(200).json({message:"تمت اضافة النص",status:200,data:{txt}})
})
 
const updateTxt=catchError(async(req,res,next)=>{
    let txt=await About.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    txt || next(new AppError("لا يوجد نص",404))
    !txt || res.status(200).json({message:"تم تعديل النص",status:200,data:{txt}})
})

const deleteTxt=catchError(async(req,res,next)=>{
    let txt=await About.findOneAndDelete({_id:req.params.id})
    txt || next(new AppError("لا يوجد نص",404))
    !txt || res.status(200).json({message:"تم حذف النص",status:200,data:[]})
})

const getText=catchError(async(req,res,next)=>{
    let txt=await About.find()
    res.status(200).json({message:"success",status:200,data:{txt}})
})



export{
    addTxt,updateTxt,deleteTxt,getText
}