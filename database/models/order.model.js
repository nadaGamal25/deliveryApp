import mongoose, { Schema, model } from "mongoose"

const orderSchema = new Schema({
  clientAddress: {
    type: String,
    required: true,
  }, 
  recieverAddress: {
    type: String,
    required: true,
  },
  clientPosition: {
    type:mongoose.Types.ObjectId,
    ref:'Position',
    required: true,
  },  
  recieverPosition: {
    type:mongoose.Types.ObjectId,
    ref:'Position',
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  }, 
  recieverName: {
    type: String,
  },
  clientPhone: {
    type: String,
    required: true,
  }, 
  recieverPhone: {
    type: String,
  },
    goDate: {
      type: Date,
      required: true,
    },
    nums: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type:{
      type:String,
      required:true
    },
    goTime:{
      type:String,
      required:true
    },
    waitingTime:{
      type:String,
    },
    notes:{
      type:String,
    },
    status:{
      type:String,
      default:'waiting'
    },
    rate:{
      type:Number,
    },
    isTips:{
      type:Boolean,
      required:true
    },
    orderImgs:{
      type:[String],
    },
  driverId: {
    type:mongoose.Types.ObjectId,
    ref:'User',
  },
  clientId: {
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
  },
  qrCode:{
    type:String,
  }


  },{
    timestamps: true
  });

  

export const Order = model('Order', orderSchema);