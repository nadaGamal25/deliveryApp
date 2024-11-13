import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addTxt, deleteTxt, getText, updateTxt } from './about.controller.js'
import { addTextVal, deleteTextVal, updateTextVal } from './about.validation.js'

const aboutRouter=express.Router()

aboutRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addTextVal) ,addTxt)
.get(getText)

aboutRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),validate(updateTextVal),updateTxt)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteTextVal),deleteTxt)

export default aboutRouter