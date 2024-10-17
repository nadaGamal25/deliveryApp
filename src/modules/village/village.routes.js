import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addVillageVal, deleteVillageVal } from './village.validation.js'
import { addVillage, deleteVillage, getVillage } from './village.controller.js'

const villageRouter=express.Router()

villageRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addVillageVal),addVillage)
.get(getVillage)

villageRouter.route('/:id')
.delete(protectedRoutes,allowedTo('admin'),validate(deleteVillageVal),deleteVillage)


export default villageRouter