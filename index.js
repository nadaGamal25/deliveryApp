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


//notifications
// import * as admin from 'firebase-admin';
// // import admin from 'firebase-admin';
// import serviceAccount from './path/to/serviceAccountKey.json' assert { type: "json" };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });



// // Send notifications to all drivers
// app.post('/notifications/drivers', async (req, res) => {
//   const { title, body } = req.body;

//   try {
//     // Get tokens of all drivers
//     const drivers = await find({ role: 'driver', fcmToken: { $exists: true } }).select('fcmToken');
//     const tokens = drivers.map((driver) => driver.fcmToken);

//     if (!tokens.length) {
//       return res.status(404).json({ message: 'No drivers found with valid tokens' });
//     }

//     const payload = {
//       notification: { title, body },
//     };

//     await admin.messaging().sendToDevice(tokens, payload);
//     res.status(200).json({ message: 'Notifications sent to all drivers' });
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     res.status(500).json({ message: 'Failed to send notifications', error });
//   }
// });

// // Send notifications to all clients
// app.post('/notifications/clients', async (req, res) => {
//   const { title, body } = req.body;

//   try {
//     // Get tokens of all clients
//     const clients = await User.find({ role: 'client', fcmToken: { $exists: true } }).select('fcmToken');
//     const tokens = clients.map((client) => client.fcmToken);

//     if (!tokens.length) {
//       return res.status(404).json({ message: 'No clients found with valid tokens' });
//     }

//     const payload = {
//       notification: { title, body },
//     };

//     await admin.messaging().sendToDevice(tokens, payload);
//     res.status(200).json({ message: 'Notifications sent to all clients' });
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     res.status(500).json({ message: 'Failed to send notifications', error });
//   }
// });

// // Send notification to a specific user
// app.post('/notifications/user/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, body } = req.body;

//   try {
//     // Get the user's FCM token
//     const user = await User.findById(id).select('fcmToken');

//     if (!user || !user.fcmToken) {
//       return res.status(404).json({ message: 'User not found or does not have a valid token' });
//     }

//     const payload = {
//       notification: { title, body },
//     };

//     await admin.messaging().sendToDevice(user.fcmToken, payload);
//     res.status(200).json({ message: 'Notification sent to the user' });
//   } catch (error) {
//     console.error('Error sending notification:', error);
//     res.status(500).json({ message: 'Failed to send notification', error });
//   }
// });




app.use('*',(req,res,next)=>{
    next(new AppError(`route not found ${req.originalUrl}`,404))
})    

app.use(globalError) 

process.on('unhandledRejection',(err)=>{
    console.log('error outside express',err)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))