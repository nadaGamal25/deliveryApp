import express from 'express'
import { uploadSingleFile } from '../../fileUpload/fileUpload.js'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addCategory, deleteCategory, getCategories, getDriversByCategory } from './category.controller.js'
import { addCategoryVal, deleteCategoryVal, getDriversByCategoryVal } from './category.validation.js'

const categoryRouter=express.Router()

categoryRouter.route('/')
.post(protectedRoutes,allowedTo('admin'),uploadSingleFile('img','category'),validate(addCategoryVal),addCategory)
.get(getCategories)

categoryRouter.route('/:id')
.delete(protectedRoutes,allowedTo('admin'),validate(deleteCategoryVal),deleteCategory)

categoryRouter.get('/drivers/:id',protectedRoutes,allowedTo('client'),validate(getDriversByCategoryVal),getDriversByCategory)

export default categoryRouter