import express from 'express'
import { getDrivers, getDriversRate, getFavDrivers, startOrder } from './driver.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { startOrderVal } from './driver.validation.js'

const driverRouter=express.Router()

driverRouter.get('/rate',getDriversRate)
driverRouter.get('/',getDrivers)
driverRouter.get('/fav',getFavDrivers)
driverRouter.put('/start',protectedRoutes,allowedTo('driver'),validate(startOrderVal),startOrder)

export default driverRouter