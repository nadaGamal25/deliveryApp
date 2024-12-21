import express from 'express'
import { uploadMixFiles } from '../../fileUpload/fileUpload.js'
import { checkEmailExist } from '../../middleware/checkEmailExist.js'
import { checkPhoneExist } from '../../middleware/checkPhoneExist.js'
import { validate } from '../../middleware/validate.js'
import { addConnect, allowedTo, changePassword, confirmOTP, deleteUser, forgetPassword, getAccountData, protectedRoutes, regenerateOtp, setNewPassword, signin, signout, signup, updateAccount } from './auth.controller.js'
import { addConnectVal, changePasswordVal, confirmOtpVal, forgetPassVal, regenerateOtpVal, signinVal, signupVal, updatePassVal, updateUserVal } from './auth.validation.js'

const authRouter=express.Router()

authRouter.post('/signup',uploadMixFiles([{name:'profileImg',maxCount:1},{name:'vehiclesImgs',maxCount:4}],'user'),validate(signupVal),checkPhoneExist,checkEmailExist,signup)
authRouter.post('/signin',validate(signinVal),signin)
authRouter.get('/signout',signout)
authRouter.put('/update-account',protectedRoutes,allowedTo('driver','client') ,
uploadMixFiles([{name:'profileImg',maxCount:1},{name:'idCardImg',maxCount:1},{name:'licenseImg',maxCount:1},{name:'vehiclesImgs',maxCount:4}],'user'),validate(updateUserVal),updateAccount)
authRouter.patch('/change-Password',protectedRoutes,allowedTo('driver','client') ,validate(changePasswordVal),changePassword)
authRouter.delete('/delete-account',protectedRoutes,allowedTo('driver','client'), deleteUser)
authRouter.get('/get-account/:id',getAccountData)
authRouter.post('/forget-password',validate(forgetPassVal),forgetPassword)
authRouter.post('/confirm-otp', validate(confirmOtpVal),confirmOTP)
authRouter.post('/update-password', validate(updatePassVal),setNewPassword)
authRouter.post('/regenerate-otp',validate(regenerateOtpVal),regenerateOtp)
authRouter.put('/add-connect/:id',validate(addConnectVal),addConnect)
 
export default authRouter