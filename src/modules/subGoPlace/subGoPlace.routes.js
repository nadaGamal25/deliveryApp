import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSubGoPlace, deleteSubGoPlace, getSubGoPlace } from './subGoPlace.controller.js'
import { addSubGoPlaceVal, deleteSubGoPlaceVal } from './subGoPlace.validation.js'

const subGoPlaceRouter=express.Router()

subGoPlaceRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addSubGoPlaceVal) ,addSubGoPlace)
.get(getSubGoPlace)

subGoPlaceRouter.route('/:id')
.delete(protectedRoutes,allowedTo('admin'),validate(deleteSubGoPlaceVal),deleteSubGoPlace)

export default subGoPlaceRouter