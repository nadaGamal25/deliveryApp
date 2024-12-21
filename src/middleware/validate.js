import { AppError } from "../utils/appError.js";

export const validate=(schema)=>{
    return (req,res,next)=>{
        const dataToValidate = {
            ...req.body,
            ...req.params,
            ...req.query
        };
        
        if (req.files) {
          if (req.files && req.files.profileImg) {
            dataToValidate.profileImg = req.files.profileImg[0];
        }
        if (req.files && req.files.idCardImg) {
          dataToValidate.idCardImg = req.files.idCardImg[0];
      }
      if (req.files && req.files.licenseImg) {
        dataToValidate.licenseImg = req.files.licenseImg[0];
    }
          if (req.files.vehiclesImgs) {
              dataToValidate.vehiclesImgs = req.files.vehiclesImgs;
          }
      }
       
        if (req.files && req.files.orderImgs) {
         
            if (req.files.orderImgs) {
                dataToValidate.orderImgs = req.files.orderImgs;
            }
        }
       
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
      
            // Check if there is only one error
            if (Object.keys(formattedErrors).length === 1) {
              // Return just the message for a single error
              const singleErrorMessage = Object.values(formattedErrors)[0];
              next(new AppError(singleErrorMessage, 401));
            } else {
              // Return key-value pairs for multiple errors
              next(new AppError(formattedErrors, 401));
            }

    }
    }
}