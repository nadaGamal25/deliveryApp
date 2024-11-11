import express from 'express'
import { validate } from '../../middleware/validate.js'
import { addFavVal, deleteFavVal, getFavVal } from './fav.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addFav, allFav, deleteFav, getFavClient, getFavDriver } from './fav.controller.js'

const favRouter=express.Router()

favRouter.route('/')
.post(protectedRoutes,allowedTo('client'),validate(addFavVal) ,addFav)
.get(allFav) 

favRouter.route('/:id')
.delete(protectedRoutes,allowedTo('client','admin'),validate(deleteFavVal),deleteFav)

favRouter.get('/by-driverid/:id',validate(getFavVal),getFavDriver)
favRouter.get('/by-clientid/:id',validate(getFavVal),getFavClient)

export default favRouter