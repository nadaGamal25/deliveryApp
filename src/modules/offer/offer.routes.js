import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addOffer, changeOfferStatus, deleteOffer, getOffersByOrderId, getOffersByUserId, getOffersForUser } from './offer.controller.js'
import { addOfferVal, changeOfferStatusVal, deleteOfferVal, getOffersByOrderIdVal, getOffersByUserIdVal } from './offer.validation.js'
import { checkUserValid } from '../../middleware/checkUserValid.js'

const offerRouter=express.Router()

offerRouter.route('/')
.post(protectedRoutes,allowedTo('driver'),checkUserValid,validate(addOfferVal),addOffer)
.get(protectedRoutes,allowedTo('driver'),getOffersForUser)

offerRouter.delete('/delete-offer/:id',protectedRoutes,allowedTo('driver','admin'),validate(deleteOfferVal),deleteOffer)
offerRouter.get('/by-orderid/:id',protectedRoutes,allowedTo('driver','admin'),validate(getOffersByOrderIdVal),getOffersByOrderId)
offerRouter.get('/by-userid/:id',protectedRoutes,allowedTo('driver','admin'),validate(getOffersByUserIdVal),getOffersByUserId)
offerRouter.put('/change-status/:id',protectedRoutes,allowedTo('client'),validate(changeOfferStatusVal),changeOfferStatus)

export default offerRouter