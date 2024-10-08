import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addOffer, changeOfferStatus, deleteOffer, getOffersByOrderId, getOffersByUserId, getOffersForUser } from './offer.controller.js'
import { addOfferVal, changeOfferStatusVal, deleteOfferVal, getOffersByOrderIdVal, getOffersByUserIdVal } from './offer.validation.js'

const offerRouter=express.Router()

offerRouter.route('/')
.post(protectedRoutes,allowedTo('user'),validate(addOfferVal),addOffer)
.get(protectedRoutes,allowedTo('user'),getOffersForUser)

offerRouter.delete('/delete-offer/:id',protectedRoutes,allowedTo('user','admin'),validate(deleteOfferVal),deleteOffer)
offerRouter.get('/by-orderid/:id',protectedRoutes,allowedTo('user','admin'),validate(getOffersByOrderIdVal),getOffersByOrderId)
offerRouter.get('/by-userid/:id',protectedRoutes,allowedTo('user','admin'),validate(getOffersByUserIdVal),getOffersByUserId)
offerRouter.put('/change-status/:id',protectedRoutes,allowedTo('client'),validate(changeOfferStatusVal),changeOfferStatus)

export default offerRouter