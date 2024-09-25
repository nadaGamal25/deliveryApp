import express from 'express'
import { allowedTo, changePassword, deleteUser, forgetPassword, getAccountData, protectedRoutes, regenerateOtp, signin, signup, updateAccount, updatePassword } from './auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { changePasswordVal, forgetPassVal, regenerateOtpVal, signinVal, signupVal, updatePassVal, updateUserVal } from './auth.validation.js'
import { checkPhoneExist } from '../../middleware/checkPhoneExist.js'
import { uploadMixFiles } from '../../fileUpload/fileUpload.js'

const authRouter=express.Router()

authRouter.post('/signup',uploadMixFiles([{name:'vehiclesImgs',maxCount:4}],'user'),validate(signupVal),checkPhoneExist,signup)
authRouter.post('/signin',validate(signinVal),signin)
authRouter.put('/update-account',protectedRoutes,allowedTo('user','client') ,uploadMixFiles([{name:'vehiclesImgs',maxCount:4}],'user'),validate(updateUserVal),updateAccount)
authRouter.patch('/change-Password',protectedRoutes,allowedTo('user','client') ,validate(changePasswordVal),changePassword)
authRouter.delete('/delete-account',protectedRoutes,allowedTo('user','client'), deleteUser)
authRouter.get('/get-account',protectedRoutes,allowedTo('user','client') ,getAccountData)
authRouter.post('/forget-password',validate(forgetPassVal),forgetPassword)
authRouter.post('/update-password', validate(updatePassVal),updatePassword)
authRouter.post('/regenerate-otp',validate(regenerateOtpVal),regenerateOtp)
 
export default authRouter