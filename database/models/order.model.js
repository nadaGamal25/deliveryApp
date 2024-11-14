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
    type: String,
    required: true,
  }, 
  recieverPosition: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  }, 
  recieverName: {
    type: String,
    required: true,
  },
  clientPhone: {
    type: String,
    required: true,
  }, 
  recieverPhone: {
    type: String,
    required: true,
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
    notes:{
      type:String,
    },
    status:{
      type:String,
      default:'pending'
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


  },{
    timestamps: true
  });

  

export const Order = model('Order', orderSchema);