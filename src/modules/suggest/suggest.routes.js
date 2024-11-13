import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addMsgSuggest, allmsgsSuggest } from './suggest.controller.js'
import { addMsgSuggestVal } from './suggest.validation.js'

const suggestRouter=express.Router()

suggestRouter.route('/')
.post(protectedRoutes,allowedTo('client','driver'),validate(addMsgSuggestVal) ,addMsgSuggest)
.get(allmsgsSuggest)

export default suggestRouter