import { User } from "../../database/models/user.model.js";


export const checkPhoneExist = async (req, res, next) => {
    const user = await User.findOne({ phone: req.body.phone });
    if (user) {
        return res.status(409).json({ message: "تم انشاء حساب برقم الهاتف هذا من قبل " });
    }

    next();
   
};