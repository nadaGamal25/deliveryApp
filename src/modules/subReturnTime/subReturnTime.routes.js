import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSubReturnTime, deleteSubReturnTime, getSubReturnTime, updateSubReturnTime } from './subReturnTime.controller.js'
import { addSubReturnTimeVal, deleteSubReturnTimeVal, updateSubReturnTimeVal } from './subReturnTime.validation.js'

const subReturnTimeRouter=express.Router()

subReturnTimeRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addSubReturnTimeVal) ,addSubReturnTime)
.get(getSubReturnTime)

subReturnTimeRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),validate(updateSubReturnTimeVal),updateSubReturnTime)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteSubReturnTimeVal),deleteSubReturnTime)

export default subReturnTimeRouter