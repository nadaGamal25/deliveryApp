import express from 'express'
import { confirmUser } from './admin.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { confirmUserVal } from './admin.validation.js'

const adminRouter=express.Router()


adminRouter.put('/confirm-user/:id',protectedRoutes,allowedTo('admin'),validate(confirmUserVal), confirmUser)



export default adminRouter

