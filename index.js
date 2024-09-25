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
dotenv.config();
const port = process.env.PORT || 3000;
// const port=3000
const app =express()
app.use(cors())
app.use(express.json())


app.use('/uploads',express.static('uploads'))

app.use('/api/auth',authRouter)  
app.use('/api/admin',adminRouter)  
app.use('/api/category',categoryRouter)  



app.use('*',(req,res,next)=>{
    next(new AppError(`route not found ${req.originalUrl}`,404))
})    

app.use(globalError)

process.on('unhandledRejection',(err)=>{
    console.log('error outside express',err)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))