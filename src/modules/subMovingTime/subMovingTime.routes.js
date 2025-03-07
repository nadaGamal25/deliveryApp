import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSubMovingTime, deleteSubMovingTime, getSubMovingTime, updateSubMovingTime } from './subMovingTime.controller.js'
import { addSubMovingTimeVal, deleteSubMovingTimeVal, updateSubMovingTimeVal } from './subMovingTime.validation.js'

const subMovingTimeRouter=express.Router()

subMovingTimeRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addSubMovingTimeVal) ,addSubMovingTime)
.get(getSubMovingTime)

subMovingTimeRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),validate(updateSubMovingTimeVal),updateSubMovingTime)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteSubMovingTimeVal),deleteSubMovingTime)

export default subMovingTimeRouter