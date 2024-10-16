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
        // const {error}=schema.validate(dataToValidate,{abortEarly:false});
        // if(!error){
        //     next()
        // }else{
        //     let errMsgs=error.details.map(err=>err.message)
        //     next(new AppError(errMsgs,401))
        // }
        const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (!error) {
      next();
    } else {
      // Format Joi error messages to be key-value pairs
      const formattedErrors = {};
      error.details.forEach((err) => {
        const key = err.context.label || err.path[0]; // Use the label or path as the key
        formattedErrors[key] = err.message; // Set the error message for the key
      });

      // Return the formatted errors in the response
      next(new AppError(formattedErrors, 401));
    }
    }
}