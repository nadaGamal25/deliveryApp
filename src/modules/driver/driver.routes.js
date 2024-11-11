import express from 'express'
import { getDriversRate } from './driver.controller.js'

const driverRouter=express.Router()

driverRouter.get('/rate',getDriversRate)

export default driverRouter