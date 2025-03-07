import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addPrivacy, deletePrivacy, getPrivacy } from './privacyPolicy.controller.js'
import { addPrivacyVal, deletePrivacyVal } from './privacyPolicy.validation.js'

const privacyRouter=express.Router()

privacyRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addPrivacyVal) ,addPrivacy)
.get(getPrivacy)

privacyRouter.route('/:id')
.delete(protectedRoutes,allowedTo('admin'),validate(deletePrivacyVal),deletePrivacy)

export default privacyRouter