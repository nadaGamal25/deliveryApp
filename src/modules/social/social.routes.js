import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSocialVal, deleteSocialVal, updateSocialVal } from './social.validation.js'
import { addSocial, deleteSocial, getSocial, updateSocial } from './social.controller.js'

const socialRouter=express.Router()

socialRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addSocialVal) ,addSocial)
.get(getSocial)

socialRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),validate(updateSocialVal),updateSocial)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteSocialVal),deleteSocial)

export default socialRouter