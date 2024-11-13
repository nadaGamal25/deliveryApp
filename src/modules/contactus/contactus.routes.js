import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addMsgContact, allmsgsContact } from './contactus.controller.js'
import { addMsgContactVal } from './contactus.validation.js'

const contactusRouter=express.Router()

contactusRouter.route('/')
.post(protectedRoutes,allowedTo('client','driver'),validate(addMsgContactVal) ,addMsgContact)
.get(allmsgsContact)

export default contactusRouter