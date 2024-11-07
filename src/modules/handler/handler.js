import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import fs from 'fs';

export const deleteOne=(model)=>{
    return catchError(async(req,res,next)=>{
        let document=await model.findOneAndDelete({_id:req.params.id})
        document || next(new AppError("document not found",404))
        !document || res.status(200).json({message:"success"})
    })
}

export const getAll=(model)=>{
    return catchError(async(req,res,next)=>{
        let document=await model.find()
        res.status(200).json({message:"success",document})
    })
}

export const getOne=(model)=>{
    return catchError(async(req,res,next)=>{
        let document=await model.findById(req.params.id)
        document || next(new AppError("document not found",404))
        !document || res.status(200).json({message:"success",document})
    })
}

