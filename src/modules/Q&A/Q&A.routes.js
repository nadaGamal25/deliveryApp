import express from 'express'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addQuestion, allQuestions, deleteQuestion, updateQuestion } from './Q&A.controller.js'
import { addQuestionVal, deleteQuestionVal, updateQuestionVal } from './Q&A.validation.js'

const questionRouter=express.Router()

questionRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),validate(addQuestionVal) ,addQuestion)
.get(allQuestions)

questionRouter.route('/:id')
.put(protectedRoutes,allowedTo('admin'),validate(updateQuestionVal),updateQuestion)
.delete(protectedRoutes,allowedTo('admin'),validate(deleteQuestionVal),deleteQuestion)

export default questionRouter