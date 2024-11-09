import { User } from "../../../database/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//confirm user
const confirmUser = catchError(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    if (user) {
        // Update the user and reassign the variable to the updated object
        user = await User.findByIdAndUpdate(req.params.id, { isConfirmed: true }, { new: true });
        res.status(200).json({ message: 'تم تأكيد الحساب بنجاح', status: 200, data: { user } });
    } else {
        return next(new AppError('المستخدم غير موجود', 400));
    }
});


//block user
const blockUser=catchError(async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    if(user){
        user= await User.findByIdAndUpdate(req.params.id, {isBlocked:true}, { new: true })
        res.status(200).json({message:'تم تأكيد الحساب بنجاح', status:200,data:{user}})
    }else{
        return next(new AppError(' المستخدم غير موجود',400))
    }
    
})

export{
    confirmUser,blockUser
}