import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSubStartingPlace, deleteSubStartingPlace, getSubStartingPlace } from './subStartingPlace.controller.js'
import { addSubStartingPlaceVal, deleteSubStartingPlaceVal } from './subStartingPlace.validation.js'

const subStartingPlaceRouter=express.Router()

subStartingPlaceRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addSubStartingPlaceVal) ,addSubStartingPlace)
.get(getSubStartingPlace)

subStartingPlaceRouter.route('/:id')
.delete(protectedRoutes,allowedTo('admin'),validate(deleteSubStartingPlaceVal),deleteSubStartingPlace)

export default subStartingPlaceRouter