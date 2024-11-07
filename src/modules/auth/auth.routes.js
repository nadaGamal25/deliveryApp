import express from 'express'
import { addConnect, allowedTo, changePassword, deleteUser, forgetPassword, getAccountData, protectedRoutes, regenerateOtp, signin, signout, signup, updateAccount, updatePassword } from './auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { addConnectVal, changePasswordVal, forgetPassVal, regenerateOtpVal, signinVal, signupVal, updatePassVal, updateUserVal } from './auth.validation.js'
import { checkPhoneExist } from '../../middleware/checkPhoneExist.js'
import { uploadMixFiles } from '../../fileUpload/fileUpload.js'
import { checkEmailExist } from '../../middleware/checkEmailExist.js'

const authRouter=express.Router()

authRouter.post('/signup',uploadMixFiles([{name:'profileImg',maxCount:1},{name:'vehiclesImgs',maxCount:4}],'user'),validate(signupVal),checkPhoneExist,checkEmailExist,signup)
authRouter.post('/signin',validate(signinVal),signin)
authRouter.get('/signout',signout)
authRouter.put('/update-account',protectedRoutes,allowedTo('driver','client') ,uploadMixFiles([{name:'profileImg',maxCount:1},{name:'vehiclesImgs',maxCount:4}],'user'),validate(updateUserVal),updateAccount)
authRouter.patch('/change-Password',protectedRoutes,allowedTo('driver','client') ,validate(changePasswordVal),changePassword)
authRouter.delete('/delete-account',protectedRoutes,allowedTo('driver','client'), deleteUser)
authRouter.get('/get-account',protectedRoutes,allowedTo('driver','client') ,getAccountData)
authRouter.post('/forget-password',validate(forgetPassVal),forgetPassword)
authRouter.post('/update-password', validate(updatePassVal),updatePassword)
authRouter.post('/regenerate-otp',validate(regenerateOtpVal),regenerateOtp)
authRouter.put('/add-connect/:id',validate(addConnectVal),addConnect)
 
export default authRouter