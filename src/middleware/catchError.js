import { AppError } from "../utils/appError.js"

// export function catchError(callback){
//     return(req,res,next)=>{
//         return callback(req,res,next).catch((err)=>{
//             console.error('Error:', err); // Log the error for debugging
//             next(new AppError(err,500))
//         })
//     }
// }

export const catchError = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        console.error("Error:", err);
        next(new AppError(err,500))
    });
};
