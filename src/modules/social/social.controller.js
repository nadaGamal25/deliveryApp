import { Social } from "../../../database/models/social.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSocial=catchError(async(req,res,next)=>{
    let social=new Social(req.body)
    await social.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{social}})
})
  
const updateSocial=catchError(async(req,res,next)=>{
    let social=await Social.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    social || next(new AppError("لا يوجد ",404))
    !social || res.status(200).json({message:"تم التعديل ",status:200,data:{social}})
})

const deleteSocial=catchError(async(req,res,next)=>{
    let social=await Social.findOneAndDelete({_id:req.params.id})
    social || next(new AppError("لا يوجد ",404))
    !social || res.status(200).json({message:"تم الحذف ",status:200,data:[]})
})

const getSocial=catchError(async(req,res,next)=>{
    let social=await Social.find()
    res.status(200).json({message:"success",status:200,data:{social:social[0]}})
})



export{
    addSocial,updateSocial,deleteSocial,getSocial
}