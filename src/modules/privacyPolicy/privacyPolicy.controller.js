import { PrivacyPolicy } from "../../../database/models/privacyPolicy.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addPrivacy=catchError(async(req,res,next)=>{
    let privacy=new PrivacyPolicy(req.body)
    await privacy.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{privacy}})
})


const deletePrivacy=catchError(async(req,res,next)=>{
    let privacy=await PrivacyPolicy.findOneAndDelete({_id:req.params.id})
    privacy || next(new AppError("لا يوجد ",404))
    !privacy || res.status(200).json({message:"تم الحذف ",status:200,data:[]})
})

const getPrivacy=catchError(async(req,res,next)=>{
    let privacy=await PrivacyPolicy.find().sort({effectiveDate:-1})
    if(privacy.length ===0){
        res.status(200).json({message:"false",status:200,data:[]})
    }
    res.status(200).json({message:"success",status:200,data:{privacy:privacy[0]}})
})



export{
    addPrivacy,deletePrivacy,getPrivacy
}