import express from 'express'
import { getDrivers, getDriversRate, getFavDrivers, startOrder } from './driver.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const driverRouter=express.Router()

driverRouter.get('/rate',getDriversRate)
driverRouter.get('/',getDrivers)
driverRouter.get('/fav',getFavDrivers)
driverRouter.put('/start',protectedRoutes,allowedTo('driver'),startOrder)

export default driverRouter