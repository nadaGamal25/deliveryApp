import express from 'express'
import { getDriversRate, getDriversSearch } from './driver.controller.js'

const driverRouter=express.Router()

driverRouter.get('/rate',getDriversRate)
driverRouter.get('/search',getDriversSearch)

export default driverRouter