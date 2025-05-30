process.on('uncaughtException',(err)=>{
    console.log('error in code',err)
})

import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import { globalError } from './src/middleware/globalError.js'
import {AppError} from './src/utils/appError.js'
import dotenv from 'dotenv';
import authRouter from './src/modules/auth/auth.routes.js'
import adminRouter from './src/modules/admin/admin.routes.js'
import categoryRouter from './src/modules/category/category.routes.js'
import cors from 'cors'
import orderRouter from './src/modules/order/order.routes.js'
import offerRouter from './src/modules/offer/offer.routes.js'
import positionRouter from './src/modules/position/position.routes.js'
import villageRouter from './src/modules/village/village.routes.js'
import reviewRouter from './src/modules/review/review.routes.js'
import mongoose from 'mongoose'
import driverRouter from './src/modules/driver/driver.routes.js'
import favRouter from './src/modules/fav/fav.routes.js'
import reviewAppRouter from './src/modules/reviewApp/reviewApp.routes.js'
import contactusRouter from './src/modules/contactus/contactus.routes.js'
import suggestRouter from './src/modules/suggest/suggest.routes.js'
import aboutRouter from './src/modules/about/about.routes.js'
import socialRouter from './src/modules/social/social.routes.js'
import questionRouter from './src/modules/Q&A/Q&A.routes.js'
import staticsRouter from './src/modules/statics/statics.routes.js'
import { User } from './database/models/user.model.js'
import notificationRouter from './src/modules/notificaions/notifications.routes.js'
import privacyRouter from './src/modules/privacyPolicy/privacyPolicy.routes.js'
import subDurationRouter from './src/modules/subscriptionDuration/subscriptionDuration.routes.js'
import subStartingPlaceRouter from './src/modules/subStartingPlace/subStartingPlace.routes.js'
import subMovingTimeRouter from './src/modules/subMovingTime/subMovingTime.routes.js'
import subReturnTimeRouter from './src/modules/subReturnTime/subReturnTime.routes.js'
import subGoPlaceRouter from './src/modules/subGoPlace/subGoPlace.routes.js'
import subscriptionRouter from './src/modules/subscriptions/subscriptions.routes.js'
import { createServer } from 'http';
import { Server } from 'socket.io';
// mongoose.set('debug', true);
dotenv.config();
const port = process.env.PORT || 3000;
// const port=3000
const app =express()
app.use(cors()),
app.use(express.text({ type: 'text/html' }));
app.use(express.json())


app.use('/uploads',express.static('uploads'))

app.use('/api/auth',authRouter)  
app.use('/api/admin',adminRouter)  
app.use('/api/category',categoryRouter)  
app.use('/api/position',positionRouter)  
app.use('/api/village',villageRouter)  
app.use('/api/order',orderRouter)  
app.use('/api/offer',offerRouter)  
app.use('/api/review',reviewRouter)  
app.use('/api/driver',driverRouter)  
app.use('/api/fav',favRouter)  
app.use('/api/review-app',reviewAppRouter)  
app.use('/api/contactus',contactusRouter)  
app.use('/api/suggest',suggestRouter)
app.use('/api/about',aboutRouter)
app.use('/api/social',socialRouter)
app.use('/api/question',questionRouter)
app.use('/api/statics',staticsRouter)
app.use('/api/notifications',notificationRouter)
app.use('/api/privacy-policy',privacyRouter)
app.use('/api/sub-duration',subDurationRouter)
app.use('/api/sub-starting-place',subStartingPlaceRouter)
app.use('/api/sub-go-place',subGoPlaceRouter)
app.use('/api/sub-moving-time',subMovingTimeRouter)
app.use('/api/sub-return-time',subReturnTimeRouter)
app.use('/api/subscription',subscriptionRouter)




app.use('*',(req,res,next)=>{
    next(new AppError(`route not found ${req.originalUrl}`,404))
})    

app.use(globalError) 

process.on('unhandledRejection',(err)=>{
    console.log('error outside express',err)
})


// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*', // or restrict to your Flutter app's domain
  }
});

// Make io globally accessible
global.io = io;

// Listen for new connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId); // Join room based on order ID
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
   