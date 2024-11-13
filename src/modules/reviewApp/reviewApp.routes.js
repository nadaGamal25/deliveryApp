import express from 'express'
import { validate } from '../../middleware/validate.js'
import { addReview, allReviews, deleteReview, updateReview } from './reviewApp.controller.js'
import { addReviewApp, deleteReviewApp, updateReviewApp } from './reviewApp.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const reviewAppRouter=express.Router()

reviewAppRouter.route('/')
.post(protectedRoutes,allowedTo('client','driver'),validate(addReviewApp) ,addReview)
.get(allReviews)

reviewAppRouter.route('/:id')
.put(protectedRoutes,allowedTo('client','driver'),validate(updateReviewApp),updateReview)
.delete(protectedRoutes,allowedTo('client','admin','driver'),validate(deleteReviewApp),deleteReview)

export default reviewAppRouter