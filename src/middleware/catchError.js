import { AppError } from "../utils/appError.js"

export function catchError(callback){
    return(req,res,next)=>{
        return callback(req,res,next).catch((err)=>{
            next(new AppError(err,500))
        })
    }
}