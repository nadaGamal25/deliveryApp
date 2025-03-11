import express from 'express'
import { uploadMixFiles } from '../../fileUpload/fileUpload.js'
import { validate } from '../../middleware/validate.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { addOrder, cancelOrder, cancelOrderByDriver, endOrder, getOrderById, getOrderByStatus, getOrdersForClient, getOrdersForDriver, getWaitingOrders, rateOrder} from '../order/order.controller.js'
import { addOrderVal, cancelOrderVal, getOrderByIdVal, getOrderByStatusVal, rateOrderVal, recieveOrderVal } from '../order/order.validation.js'
const orderRouter=express.Router()

orderRouter.route('/')
.post(protectedRoutes,allowedTo('client'),uploadMixFiles([{name:'orderImgs',maxCount:10}],'order'),validate(addOrderVal),addOrder)

orderRouter.get('/orders-by-status',protectedRoutes,allowedTo('client','driver'),validate(getOrderByStatusVal),getOrderByStatus)
orderRouter.get('/orders-client',protectedRoutes,allowedTo('client'),getOrdersForClient)
orderRouter.get('/orders-driver',protectedRoutes,allowedTo('driver'),getOrdersForDriver)
orderRouter.get('/waiting-orders',protectedRoutes,allowedTo('driver'),getWaitingOrders)

orderRouter.put('/cancel-order/:id',protectedRoutes,allowedTo('client','admin'),validate(cancelOrderVal),cancelOrder)
orderRouter.put('/cancel-by-driver/:id',protectedRoutes,allowedTo('driver'),validate(cancelOrderVal),cancelOrderByDriver)
orderRouter.get('/:id',protectedRoutes,allowedTo('client','admin'),validate(getOrderByIdVal),getOrderById)
orderRouter.put('/rate-order/:id',protectedRoutes,allowedTo('client'),validate(rateOrderVal),rateOrder)
orderRouter.put('/recieve-order/:id',validate(recieveOrderVal),endOrder)

export default orderRouter