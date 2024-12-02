import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { getMostOrderedAreasClient, getMostOrderedAreasDriver, getMostOrderedClient, getMostOrderedDriver, getMostTimesClient, getMostTimesDriver, getNumsOfOrder, getStaticsClient, getStaticsDriver } from './statics.controller.js'

const staticsRouter=express.Router()

staticsRouter.get('/nums-orders',protectedRoutes,allowedTo('client','driver'),getNumsOfOrder)
staticsRouter.get('/areas-orders-client',protectedRoutes,allowedTo('client'),getMostOrderedAreasClient)
staticsRouter.get('/most-drivers',protectedRoutes,allowedTo('client'),getMostOrderedDriver)
staticsRouter.get('/most-times-client',protectedRoutes,allowedTo('client'),getMostTimesClient)
staticsRouter.get('/areas-orders-driver',protectedRoutes,allowedTo('driver'),getMostOrderedAreasDriver)
staticsRouter.get('/most-clients',protectedRoutes,allowedTo('driver'),getMostOrderedClient)
staticsRouter.get('/most-times-driver',protectedRoutes,allowedTo('driver'),getMostTimesDriver)
staticsRouter.get('/client',protectedRoutes,allowedTo('client'),getStaticsClient)
staticsRouter.get('/driver',protectedRoutes,allowedTo('driver'),getStaticsDriver)

export default staticsRouter