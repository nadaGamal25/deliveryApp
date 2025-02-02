import express from 'express'
import { changeFav, changeOnline, getDrivers, getDriversForClient, getDriversRate, getFavDrivers, getMyFav, startOrder } from './driver.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { onlineVal, startOrderVal } from './driver.validation.js'

const driverRouter=express.Router()

driverRouter.get('/rate',getDriversRate)
driverRouter.get('/',getDrivers)
driverRouter.get('/fav',getFavDrivers)
driverRouter.put('/start',protectedRoutes,allowedTo('driver'),validate(startOrderVal),startOrder)
driverRouter.put('/online',protectedRoutes,allowedTo('driver'),validate(onlineVal),changeOnline)
driverRouter.get('/favorites',protectedRoutes,allowedTo('client'),getDriversForClient)
driverRouter.get('/favorite/:driverId',protectedRoutes,allowedTo('client'),changeFav)
driverRouter.get('/my-fav',protectedRoutes,allowedTo('client'),getMyFav)

export default driverRouter