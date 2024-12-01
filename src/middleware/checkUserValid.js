import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/appError.js";


export const checkUserValid = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id });
    if (user.isValid === false) {
        return next(new AppError( "يجب دفع اشتراك التطبيق لتتمكن من تقديم عرضك..يرجى التواصل مع الادمن ",409))
    }

    next();
   
};  