import { AppError } from "../utils/appError.js";

export const validate=(schema)=>{
    return (req,res,next)=>{
        const dataToValidate = {
            ...req.body,
            ...req.params,
            ...req.query
        };
        
        if (req.file && req.file.fieldname === 'profileImg') {
            dataToValidate.profileImg = req.file;
        }
        if (req.files && req.files.vehiclesImgs) {
         
            if (req.files.vehiclesImgs) {
                dataToValidate.vehiclesImgs = req.files.vehiclesImgs;
            }
        }
        if (req.files && req.files.orderImgs) {
         
            if (req.files.orderImgs) {
                dataToValidate.orderImgs = req.files.orderImgs;
            }
        }
        const {error}=schema.validate(dataToValidate,{abortEarly:false});
        if(!error){
            next()
        }else{
            let errMsgs=error.details.map(err=>err.message)
            next(new AppError(errMsgs,401))
        }
    }
}