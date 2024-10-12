import express from 'express'
import { blockUser, confirmUser } from './admin.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { blockUserVal, confirmUserVal } from './admin.validation.js'

const adminRouter=express.Router()


adminRouter.put('/confirm-user/:id',protectedRoutes,allowedTo('admin'),validate(confirmUserVal), confirmUser)
adminRouter.put('/block-user/:id',protectedRoutes,allowedTo('admin'),validate(blockUserVal), blockUser)



export default adminRouter

