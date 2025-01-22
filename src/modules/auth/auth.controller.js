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
import { Review } from "../../../database/models/review.model.js";
dotenv.config();
const secretKey = process.env.SECRET_KEY;

//Sign Up   
const signup=catchError(async(req,res,next)=>{
    if (req.files && req.files.vehiclesImgs) {
        req.body.vehiclesImgs = [];
        
        for (let img of req.files.vehiclesImgs) {
            try {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.vehiclesImgs.push(cloudinaryResult.secure_url);
            } catch (error) {
                console.error('Error uploading to Cloudinary', error);
                return next(new AppError('خطأ فى تحميل الصور', 400));
            }
        }
    }
  
    if (req.files && req.files.profileImg && req.files.profileImg[0]) {
        try {
            const cloudinaryResult = await uploadToCloudinary(req.files.profileImg[0].buffer, 'user', req.files.profileImg[0].originalname);
            req.body.profileImg = cloudinaryResult.secure_url; // Ensure this line sets a string in `req.body.profileImg`
        } catch (error) {
            return next(new AppError('خطأ فى تحميل الصورة', 400));
        }
    }
    
    // if (req.files.vehiclesImgs) req.body.vehiclesImgs = req.files.vehiclesImgs.map(img => img.path); // Get the Cloudinary image URL

    // if(req.files.vehiclesImgs) req.body.vehiclesImgs=req.files.vehiclesImgs.map(img=>img.filename)

    let user =new User(req.body)
    await user.save()
    let token = jwt.sign({userId:user._id, role:user.role},secretKey)
    if(user.role =='driver'){
        res.status(201).json({message:'سوف يتم التواصل معك لتأكيد الحساب فى خلال 48 ساعة',status:201,data:{'user':user, token}})
    }else{
        await User.updateOne({ _id: user._id }, { $set: { isConfirmed: true } }, { new: true });
        res.status(201).json({message:'تم انشاء حساب بنجاح',status:201,data:{'user':user,token}})
    }
})




//sign in  
// const signin=catchError(async(req,res,next)=>{
//     let user = await User.findOne({phone: req.body.phone})
//     if(!user) return next(new AppError('لا يوجد حساب برقم الهاتف الذى ادخلته',400))
//         if(user.isConfirmed ===false) return next(new AppError('يجب تأكيد حسابك من خلال المسؤل أولا لتتمكن من تسجيل الدخول',400))
//         if(user.isBlocked ===true) return next(new AppError('تم حظر هذا الحساب',400))
//         if(!user || !bcrypt.compareSync(req.body.password,user.password))
//         return next(new AppError('كلمة المرور غير صحيحة',400))
//     jwt.sign({userId:user._id,role:user.role},secretKey,async(err,token)=>{
//         if(err)return next(new AppError('حدث خطأ ما',500))
//             res.status(200).json({message:'تم تسجيل الدخول بنجاح',status:200,data:{'user':user,token}})
//     })
    
// })
const signin = catchError(async (req, res, next) => {
    const { phone, password, fcmToken } = req.body;

    // Find user by phone
    let user = await User.findOne({ phone });
    if (!user) return next(new AppError('لا يوجد حساب برقم الهاتف الذى ادخلته', 400));

    // Check if the account is confirmed
    if (user.isConfirmed === false)
        return next(new AppError('يجب تأكيد حسابك من خلال المسؤل أولا لتتمكن من تسجيل الدخول', 400));

    // Check if the account is blocked
    if (user.isBlocked === true)
        return next(new AppError('تم حظر هذا الحساب', 400));

    // Check password validity
    if (!bcrypt.compareSync(password, user.password))
        return next(new AppError('كلمة المرور غير صحيحة', 400));

    // Generate JWT token
    jwt.sign({ userId: user._id, role: user.role }, secretKey, async (err, token) => {
        if (err) return next(new AppError('حدث خطأ ما', 500));

        try {
            // Update the user's FCM token if provided
            if (fcmToken) {
                await User.findByIdAndUpdate(user._id, { fcmToken });
            }

            // Respond with success message and data
            res.status(200).json({
                message: 'تم تسجيل الدخول بنجاح',
                status: 200,
                data: { user, token },
            });
        } catch (error) {
            console.error('Error updating FCM token:', error);
            return next(new AppError('فشل تحديث رمز FCM', 500));
        }
    });
});


//sign out
const signout=catchError(async(req,res,next)=>{
    res.clearCookie('token')
    res.status(200).json({message:'تم تسجيل الخروج بنجاح',status:200,data:[]})
})


//change password
const changePassword=catchError(async(req,res,next)=>{
    let user = await User.findById(req.user._id)
    // console.log(req.body.oldPassword,user.password)

    if (req.body.oldPassword ===  req.body.newPassword)
        return next(new AppError('لا يمكن ادخال نفس كلمة المرور القديمة', 400));
    if(user && bcrypt.compareSync(req.body.oldPassword,user.password)){
        let token = jwt.sign({userId:user._id, role:user.role},secretKey)
        await User.findByIdAndUpdate(req.user._id, {password:req.body.newPassword,passwordChangedAt:Date.now()}, { new: true })
        res.status(200).json({message:'تم تغيير كلمة المرور بنجاح',status:200,data:{token}})
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
    if(!user) return next(new AppError('المستخدم غير صالح',404))

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

const updateAccount = catchError(async (req, res, next) => {
    try {
        console.log('Before processing:', req.body, req.files);

        // Process files
        if (req.files && req.files.vehiclesImgs) {
            req.body.vehiclesImgs = [];
            for (let img of req.files.vehiclesImgs) {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.vehiclesImgs.push(cloudinaryResult.secure_url);
            }
        }

        if (req.files && req.files.profileImg && req.files.profileImg[0]) {
            const cloudinaryResult = await uploadToCloudinary(req.files.profileImg[0].buffer, 'user', req.files.profileImg[0].originalname);
            req.body.profileImg = cloudinaryResult.secure_url;
        }
        if (req.files && req.files.idCardImg && req.files.idCardImg[0]) {
            const cloudinaryResult = await uploadToCloudinary(req.files.idCardImg[0].buffer, 'user', req.files.idCardImg[0].originalname);
            req.body.idCardImg = cloudinaryResult.secure_url;
        }
        if (req.files && req.files.licenseImg && req.files.licenseImg[0]) {
            const cloudinaryResult = await uploadToCloudinary(req.files.licenseImg[0].buffer, 'user', req.files.licenseImg[0].originalname);
            req.body.licenseImg = cloudinaryResult.secure_url;
        }

        console.log('After processing files:', req.body);

        // Validate user
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new AppError('المستخدم غير موجود', 404));
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        res.status(200).json({ message: 'تم تعديل البيانات بنجاح', status: 200, data: { updatedUser } });
    } catch (error) {
        console.error('Error in updateAccount:', error);
        return next(new AppError(error.message || 'خطأ غير معروف', 500));
    }
});


// //update account.
// const updateAccount = catchError(async (req, res, next) => {
//     if (req.files && req.files.vehiclesImgs) {
//         req.body.vehiclesImgs = [];
        
//         for (let img of req.files.vehiclesImgs) {
//             try {
//                 const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
//                 req.body.vehiclesImgs.push(cloudinaryResult.secure_url);
//             } catch (error) {
//                 console.error('Error uploading to Cloudinary', error);
//                 return next(new AppError('خطأ ف تحميل الصور', 500));
//             }
//         }
//     }
//     if (req.files && req.files.profileImg[0]) {
//         const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'user', req.file.originalname);
//         req.body.profileImg = cloudinaryResult.secure_url; // Store Cloudinary URL in req.body
//     }

//     let user = await User.findById(req.user._id);
//     if (!user) {
//         return next(new AppError('المستخدم غير موجود', 404));
//     }
    
//     user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });

//     res.status(200).json({ message: 'تم تعديل البيانات بنجاح', status:200,data:{user} });
// });

//delete account.
const deleteUser = catchError(async (req, res, next) => {
    let user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }
    res.status(200).json({ message: 'تم حذف الحساب بنجاح', status:200,data:[]});
});

//Get user account data 
const getAccountData = catchError(async (req, res, next) => {
    let user = await User.findById(req.params.id).populate({
        path: 'myReviews',
        select: 'comment rate client', 
      }).populate({ path: 'categoryId', select: 'name', strictPopulate: false })
        .populate({ path: 'position', select: 'name', strictPopulate: false })
        .populate({ path: 'village', select: 'name ', strictPopulate: false })
        

    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }
    res.status(200).json({ message: 'success', status: 200, data: { user } });
});


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-character OTP
};
// Forget Password
const forgetPassword = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('الايميل غير صحيح', 404));
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    
    const mail=user.email
    sendEmail(mail,otp);

    res.status(200).json({ message: 'تم ارسال الكود..قم بتفقد بريدك الالكترونى',status:200,data:[]});
});

// send otp to Update password 
const confirmOTP = catchError(async (req, res, next) => {
    const { otp } = req.body;

    let user = await User.findOne({
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() } // Ensure OTP is not expired
    });

    if (!user) {
        return next(new AppError('الكود غير صالح أو تم انتهاء صلاحيته', 400));
    }

    res.status(200).json({ message: 'تم تأكيد الكود بنجاح', status: 200, data: { userId: user._id } });
});


//Update password 
const setNewPassword = catchError(async (req, res, next) => {
    const { userId, newPassword } = req.body;

    let user = await User.findById(userId);

    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }

    // Update the password and other related fields
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح', status: 200, data: [] });
});

// const updatePassword = catchError(async (req, res, next) => {
//     const { otp, newPassword } = req.body;

//     let user = await User.findOne({
//         resetPasswordOTP: otp,
//         resetPasswordExpires: { $gt: Date.now() } // Ensure OTP is not expired
//     });
//     if (user) {
//         await User.findByIdAndUpdate(user._id, {password:req.body.newPassword,
//             newPassword:undefined,resetPasswordExpires:undefined,passwordChangedAt:Date.now()}, { new: true })
//     }else{
//         return next(new AppError('الكود غير صالح او تم انتهاء صلاحيته', 400));
//     }
          
//     res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح', status:200,data:[] });
// }); 


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

    res.status(200).json({ message: 'تم ارسال الكود مرة اخرى..تفقد بريدك الالكترونى', status:200,data:[] });
}
)

// add connect for user
const addConnect = catchError(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    
    if (!user) {
        return next(new AppError("هذا المستخدم غير موجود", 404));
    } else{
        await User.updateOne({ _id:req.params.id},  { $inc: { numberOfConnect: 1 } } );
        res.status(200).json({ message: "تم " , status:200,data:{user}});
    } 
});

export{
    signup,signin,updateAccount,deleteUser,getAccountData,changePassword,protectedRoutes,allowedTo,
    forgetPassword,regenerateOtp,addConnect,signout,confirmOTP,setNewPassword
}