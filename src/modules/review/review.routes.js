import express from 'express'
import { validate } from '../../middleware/validate.js'
import { addReview, allReviews, deleteReview, getReviewClient, getReviewDriver, updateReview } from './review.controller.js'
import { addReviewVal, deleteReviewVal, getReviewVal, updateReviewVal } from './review.validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'

const reviewRouter=express.Router()

reviewRouter.route('/')
.post(protectedRoutes,allowedTo('client'),validate(addReviewVal) ,addReview)
.get(allReviews)

reviewRouter.route('/:id')
.put(protectedRoutes,allowedTo('client'),validate(updateReviewVal),updateReview)
.delete(protectedRoutes,allowedTo('client','admin'),validate(deleteReviewVal),deleteReview)

reviewRouter.get('/by-driverid/:id',validate(getReviewVal),getReviewDriver)
reviewRouter.get('/by-clientid/:id',validate(getReviewVal),getReviewClient)

export default reviewRouter