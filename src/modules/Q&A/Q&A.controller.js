import { QandA } from "../../../database/models/Q&A.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addQuestion=catchError(async(req,res,next)=>{
    let data=new QandA(req.body)
    await data.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{data}})
})
 
const updateQuestion=catchError(async(req,res,next)=>{
    let data=await QandA.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    data || next(new AppError("لا يوجد سؤال",404))
    !data || res.status(200).json({message:"تم تعديل الاضافة",status:200,data:{data}})
})

const deleteQuestion=catchError(async(req,res,next)=>{
    let data=await QandA.findOneAndDelete({_id:req.params.id})
    data || next(new AppError("لا يوجد سؤال",404))
    !data || res.status(200).json({message:"تم حذف سؤالك",status:200,data:[]})
})

const allQuestions=catchError(async(req,res,next)=>{
    let data=await QandA.find()
    res.status(200).json({message:"success",status:200,data:{data}})
})



export{
    addQuestion,updateQuestion,deleteQuestion,allQuestions
}