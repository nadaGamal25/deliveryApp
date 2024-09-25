import { User } from "../../database/models/user.model.js";


export const checkEmailExist = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(409).json({ message: "Email already exists" });
    }

    next();
   
};