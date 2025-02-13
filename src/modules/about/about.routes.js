import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addAbout, addAbout2, deleteAbout, getAbout, updateAbout } from './about.controller.js'
import { addTextVal, deleteTextVal, updateTextVal } from './about.validation.js'

const aboutRouter=express.Router()

aboutRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),addAbout)
.get(getAbout)

aboutRouter.post('/add2',protectedRoutes,allowedTo('admin'),addAbout2)

aboutRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),updateAbout)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteTextVal),deleteAbout)

export default aboutRouter