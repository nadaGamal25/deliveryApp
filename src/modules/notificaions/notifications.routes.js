import express from 'express'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { getNotifications, notifyAllClients, notifyAllDrivers, notifyUser } from './notifications.controller.js'

const notificationRouter=express.Router()

notificationRouter.post('/to-clients',protectedRoutes,allowedTo('admin'),notifyAllClients)
notificationRouter.post('/to-drivers',protectedRoutes,allowedTo('admin'),notifyAllDrivers)
notificationRouter.post('/to-user/:userId',protectedRoutes,allowedTo('admin'),notifyUser)
notificationRouter.get('/:userId',getNotifications)


export default notificationRouter