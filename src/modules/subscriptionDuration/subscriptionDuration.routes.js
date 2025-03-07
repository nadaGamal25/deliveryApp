import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSubDuration, deleteSubDuration, getSubDuration, updateSubDuration } from './subscriptionDuration.controller.js'
import { addSubDurationVal, deleteSubDurationVal, updateSubDurationVal } from './subscriptionDuration.validation.js'

const subDurationRouter=express.Router()

subDurationRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addSubDurationVal) ,addSubDuration)
.get(getSubDuration)

subDurationRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),validate(updateSubDurationVal),updateSubDuration)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteSubDurationVal),deleteSubDuration)

export default subDurationRouter