import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";


export const checkPhoneExist = async (req, res, next) => {
    const user = await User.findOne({ phone: req.body.phone });
    if (user) {
        return next(new AppError( "تم انشاء حساب برقم الهاتف هذا من قبل ",409))
    }

    next();
   
};