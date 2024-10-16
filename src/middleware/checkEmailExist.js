import { User } from "../../database/models/user.model.js";


export const checkEmailExist = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return next(new AppError( "تم انشاء حساب بهذا الايميل من قبل ",409))
    }

    next();
   
};