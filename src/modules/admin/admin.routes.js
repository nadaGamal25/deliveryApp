import express from 'express'
import { blockUser, confirmUser, deleteUser, getClients, getOrders, getUsersOrderedOrders, invalidUser, updateUser, updateWallet } from './admin.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { blockUserVal, confirmUserVal, invalidUserVal } from './admin.validation.js'
import { updateUserVal } from '../auth/auth.validation.js'
import { uploadMixFiles } from '../../fileUpload/fileUpload.js'

const adminRouter=express.Router()


adminRouter.put('/confirm-user/:id',protectedRoutes,allowedTo('admin'),validate(confirmUserVal), confirmUser)
adminRouter.put('/block-user/:id',protectedRoutes,allowedTo('admin'),validate(blockUserVal), blockUser)
adminRouter.put('/invalid-user/:id',protectedRoutes,allowedTo('admin'),validate(invalidUserVal), invalidUser)
adminRouter.put('/update-user/:id',protectedRoutes,allowedTo('admin'),validate(updateUserVal),uploadMixFiles([{name:'profileImg',maxCount:1},
    {name:'idCardImg',maxCount:1},{name:'licenseImg',maxCount:1},{name:'vehiclesImgs',maxCount:4}],'user'), updateUser)
adminRouter.put('/update-wallet/:id',protectedRoutes,allowedTo('admin'), updateWallet)
adminRouter.get('/get-clients',protectedRoutes,allowedTo('admin'), getClients)
adminRouter.get('/get-orders',protectedRoutes,allowedTo('admin'), getOrders)
adminRouter.get('/get-users-numberOfOrders',protectedRoutes,allowedTo('admin'), getUsersOrderedOrders)
adminRouter.delete('/delete-user/:id',protectedRoutes,allowedTo('admin'), deleteUser)



export default adminRouter

