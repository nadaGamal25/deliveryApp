import express from 'express'
import { getNotifications, notifyAllClients, notifyAllDrivers, notifyUser } from './notifications.controller.js'

const notificationRouter=express.Router()

notificationRouter.post('/to-clients',notifyAllClients)
notificationRouter.post('/to-drivers',notifyAllDrivers)
notificationRouter.post('/to-user/:userId',notifyUser)
notificationRouter.get('/:userId',getNotifications)


export default notificationRouter