import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addPosition, deletePosition, getPositions } from './position.controller.js'
import { addPositionVal, deletePositionVal } from './position.validation.js'

const positionRouter=express.Router()

positionRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addPositionVal),addPosition)
.get(getPositions)

positionRouter.route('/:id')
.delete(protectedRoutes,allowedTo('admin'),validate(deletePositionVal),deletePosition)


export default positionRouter