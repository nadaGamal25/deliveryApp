import { User } from "../../../database/models/user.model.js"
import jwt from 'jsonwebtoken'
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import { sendEmail } from "../../email/email.js";
import {deleteImageFile} from "../../utils/deleteOldImage.js"
import moment from 'moment-timezone';
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
dotenv.config();
const secretKey = process.env.SECRET_KEY;

//Sign Up  
const signup=catchError(async(req,res)=>{
    if (req.files && req.files.vehiclesImgs) {
        req.body.vehiclesImgs = [];
        
        for (let img of req.files.vehiclesImgs) {
            try {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.vehiclesImgs.push(cloudinaryResult.secure_url);
            } catch (error) {
                console.error('Error uploading to Cloudinary', error);
            }
        }
    }
    if (req.file && req.file.profileImg) {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'category', req.file.originalname);
        req.body.profileImg = cloudinaryResult.secure_url; // Store Cloudinary URL in req.body
    }
    // if (req.files.vehiclesImgs) req.body.vehiclesImgs = req.files.vehiclesImgs.map(img => img.path); // Get the Cloudinary image URL

    // if(req.files.vehiclesImgs) req.body.vehiclesImgs=req.files.vehiclesImgs.map(img=>img.filename)
    
    let user =new User(req.body)
    await user.save()
    let token = jwt.sign({userId:user._id, role:user.role},secretKey)
    if(user.role =='user'){
        res.status(201).json({message:'سوف يتم التواصل معك لتأكيد الحساب فى خلال 48 ساعة',user,token,role:user.role})
    }else{
        await User.updateOne({ _id: user._id }, { $set: { isConfirmed: true } });
        res.status(201).json({message:'تم انشاء حساب بنجاح',user,token,role:user.role})
    }
})




//sign in  
const signin=catchError(async(req,res,next)=>{
    let user = await User.findOne({phone: req.body.phone})
    if(!user) return next(new AppError('لا يوجد حساب برقم الهاتف الذى ادخلته',400))
    if(user.isConfirmed ===false) return next(new AppError('يجب تأكيد حسابك من خلال المسؤل أولا لتتمكن من تسجيل الدخول','400'))
    if(!user || !bcrypt.compareSync(req.body.password,user.password))
        return next(new AppError('كلمة المرور غير صحيحة',400))
    jwt.sign({userId:user._id,role:user.role},secretKey,async(err,token)=>{
        if(err)return next(new AppError('حدث خطأ ما',500))
            res.status(200).json({message:'تم تسجيل الدخول بنجاح',token:token,role:user.role})
    })
    
})

//change password
const changePassword=catchError(async(req,res,next)=>{
    let user = await User.findById(req.user._id)
    console.log(req.body.oldPassword,user.password)
    if(user && bcrypt.compareSync(req.body.oldPassword,user.password)){
        let token = jwt.sign({userId:user._id, role:user.role},secretKey)
        await User.findByIdAndUpdate(req.user._id, {password:req.body.newPassword,passwordChangedAt:Date.now()}, { new: true })
        res.status(200).json({message:'تم تغيير كلمة المرور بنجاح',token:token})
    }
    next(new AppError('كلمة المرور غير صالحة',400))
})


//protectedRoutes
const protectedRoutes=catchError(async(req,res,next)=>{
   let {token}=req.headers
   let userPayload =null
   if(!token) return next(new AppError('الرمز غير موجود',401))
    jwt.verify(token,secretKey,(err,payload)=>{
        if(err)return next(new AppError(' الرمز غير صحيح',401))
            userPayload=payload

    })
    let user=await User.findById(userPayload.userId)
    if(!user) return next(new AppError('المستخدم غير موجود',404))

    if(user.passwordChangedAt){
        let time=parseInt(user.passwordChangedAt.getTime() /1000)
        if(time>userPayload.iat) return next(new AppError('الرمز غير صحيح..قم بتسجيل الدخول مرة اخرى',401))
    }    
    req.user =user
    next()

})

//allowed to
const allowedTo=(...roles)=>{
    return catchError(async(req,res,next)=>{
        if(roles.includes((req.user.role)))
            return next()
        return next(new AppError('ليس لديك صلاحية لعمل ذلك',403))
    })
} 



//update account.
const updateAccount = catchError(async (req, res, next) => {
    if (req.files && req.files.vehiclesImgs) {
        req.body.vehiclesImgs = [];
        
        for (let img of req.files.vehiclesImgs) {
            try {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.vehiclesImgs.push(cloudinaryResult.secure_url);
            } catch (error) {
                console.error('Error uploading to Cloudinary', error);
                // You can also handle this error and send a response accordingly
            }
        }
    }
    if (req.file && req.file.profileImg) {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'category', req.file.originalname);
        req.body.profileImg = cloudinaryResult.secure_url; // Store Cloudinary URL in req.body
    }
    // if (req.files.vehiclesImgs) req.body.vehiclesImgs = req.files.vehiclesImgs.map(img => img.path); // Get the Cloudinary image URL

    // if(req.files.vehiclesImgs) req.body.vehiclesImgs=req.files.vehiclesImgs.map(img=>img.filename)
    let user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }
    
    user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });

    res.status(200).json({ message: 'تم تعديل البيانات بنجاح', user });
});

//delete account.
const deleteUser = catchError(async (req, res, next) => {
    let user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }
    res.status(200).json({ message: 'تم حذف الحساب بنجاح'});
});

//Get user account data 
const getAccountData=catchError(async(req,res)=>{
    let user = await User.findById(req.user._id).populate('cacategoryId','name - img');
    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }
    res.status(200).json({message:'success',user})   
})

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-character OTP
};
// Forget Password
const forgetPassword = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    
    const mail=user.email
    sendEmail(mail,otp);

    res.status(200).json({ message: 'تم ارسال الكود..قم بتفقد بريدك الالكترونى' });
});

//Update password 
const updatePassword = catchError(async (req, res, next) => {
    const { otp, newPassword } = req.body;

    let user = await User.findOne({
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() } // Ensure OTP is not expired
    });
    if (user) {
        await User.findByIdAndUpdate(user._id, {password:req.body.newPassword,
            newPassword:undefined,resetPasswordExpires:undefined,passwordChangedAt:Date.now()}, { new: true })
    }else{
        return next(new AppError('الكود غير صالح او تم انتهاء صلاحيته', 400));
    }
          
    res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' });
});


const regenerateOtp = catchError(async (req, res,next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new AppError('المستخدم غير موجود',404))
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpired = new Date(Date.now() + 10 * 60 * 1000); 

    user.resetPasswordOTP = otpCode;
    user.resetPasswordExpires = otpExpired;
    await user.save();

    sendEmail(user.email, otpCode);

    res.status(200).json({ message: 'تم ارسال الكود مرة اخرى..تفقد بريدك الالكترونى' });
}
)

// add connect for user
const addConnect = catchError(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    
    if (!user) {
        return next(new AppError("هذا المستخدم غير موجود", 404));
    } else{
        await User.updateOne({ _id:req.params.id},  { $inc: { numberOfConnect: 1 } } );
        res.status(200).json({ message: "تم " ,user});
    } 
});

export{
    signup,signin,updateAccount,deleteUser,getAccountData,changePassword,protectedRoutes,allowedTo,
    forgetPassword,updatePassword,regenerateOtp,addConnect
}