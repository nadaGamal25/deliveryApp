import express from 'express'
import { blockUser, confirmSubscription, confirmUser, deleteUser, getClients, getOrders, getUsersOrderedOrders, highlightUser, invalidUser, updateOrder, updateUser, updateWallet } from './admin.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validate.js'
import { blockUserVal, confirmSubVal, confirmUserVal, highlightUserVal, invalidUserVal, updateOrderVal } from './admin.validation.js'
import { updateUserVal } from '../auth/auth.validation.js'
import { uploadMixFiles } from '../../fileUpload/fileUpload.js'

const adminRouter=express.Router()


adminRouter.put('/confirm-user/:id',protectedRoutes,allowedTo('admin'),validate(confirmUserVal), confirmUser)
adminRouter.put('/block-user/:id',protectedRoutes,allowedTo('admin'),validate(blockUserVal), blockUser)
adminRouter.put('/invalid-user/:id',protectedRoutes,allowedTo('admin'),validate(invalidUserVal), invalidUser)
adminRouter.put('/highlight-user/:id',protectedRoutes,allowedTo('admin'),validate(highlightUserVal), highlightUser)
adminRouter.put('/update-user/:id',protectedRoutes,allowedTo('admin'),validate(updateUserVal),uploadMixFiles([{name:'profileImg',maxCount:1},
    {name:'idCardImg',maxCount:2},{name:'licenseImg',maxCount:2},{name:'vehiclesImgs',maxCount:4},{name:'licenseVehicleImgs',maxCount:2}],'user'), updateUser)
adminRouter.put('/update-wallet/:id',protectedRoutes,allowedTo('admin'), updateWallet)
adminRouter.get('/get-clients',protectedRoutes,allowedTo('admin'), getClients)
adminRouter.get('/get-orders',protectedRoutes,allowedTo('admin'), getOrders)
adminRouter.get('/get-users-numberOfOrders',protectedRoutes,allowedTo('admin'), getUsersOrderedOrders)
adminRouter.delete('/delete-user/:id',protectedRoutes,allowedTo('admin'), deleteUser)
adminRouter.put('/confirm-sub/:id',protectedRoutes,allowedTo('admin'), validate(confirmSubVal),confirmSubscription)
adminRouter.put('/update-order/:id',protectedRoutes,allowedTo('admin'),uploadMixFiles([{name:'orderImgs',maxCount:10}],'order'),validate(updateOrderVal),updateOrder)




export default adminRouter

