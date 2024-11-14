import express from 'express'
import { getDrivers, getDriversRate, getFavDrivers } from './driver.controller.js'

const driverRouter=express.Router()

driverRouter.get('/rate',getDriversRate)
driverRouter.get('/',getDrivers)
driverRouter.get('/fav',getFavDrivers)

export default driverRouter