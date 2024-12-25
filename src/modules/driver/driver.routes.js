import express from 'express'
import { changeOnline, getDrivers, getDriversRate, getFavDrivers, startOrder } from './driver.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { onlineVal, startOrderVal } from './driver.validation.js'

const driverRouter=express.Router()

driverRouter.get('/rate',getDriversRate)
driverRouter.get('/',getDrivers)
driverRouter.get('/fav',getFavDrivers)
driverRouter.put('/start',protectedRoutes,allowedTo('driver'),validate(startOrderVal),startOrder)
driverRouter.put('/online',protectedRoutes,allowedTo('driver'),validate(onlineVal),changeOnline)

export default driverRouter