import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSubscriptions, cancelSubscription, getsubscriptions, getsubscriptionsForClient, updateSubscriptions } from './subscriptions.controller.js'
import { addSubscriptionVal, deleteSubscriptionVal, updateSubscriptionVal } from './subscriptions.validation.js'

const subscriptionRouter=express.Router()

subscriptionRouter.route('/')
.post(protectedRoutes,allowedTo('client'),validate(addSubscriptionVal) ,addSubscriptions)

subscriptionRouter.get('/for-admin',protectedRoutes,allowedTo('admin'),getsubscriptions)
subscriptionRouter.get('/for-client',protectedRoutes,allowedTo('client'),getsubscriptionsForClient)

subscriptionRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin','client'),validate(updateSubscriptionVal),updateSubscriptions)
.delete(protectedRoutes,allowedTo('admin','client'),validate(deleteSubscriptionVal),cancelSubscription)

export default subscriptionRouter