import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addSubscriptions, cancelSubscription, getsubscriptions, updateSubscriptions } from './subscriptions.controller.js'
import { addSubscriptionVal, deleteSubscriptionVal, updateSubscriptionVal } from './subscriptions.validation.js'

const subscriptionRouter=express.Router()

subscriptionRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addSubscriptionVal) ,addSubscriptions)
.get(getsubscriptions)

subscriptionRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),validate(updateSubscriptionVal),updateSubscriptions)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteSubscriptionVal),cancelSubscription)

export default subscriptionRouter