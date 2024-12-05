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
    default:""
  },
  clientPhone: {
    type: String,
    required: true,
  }, 
  recieverPhone: {
    type: String,
    default:""
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
      default:""
    },
    notes:{
      type:String,
      default:""
    },
    status:{
      type:String,
      default:'waiting'
    },
    rate:{
      type:Number,
      default:0
    },
    isTips:{
      type:Boolean,
      required:true
    },
    orderImgs:{
      type:[String],
      default:[]
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
    default:""
  }


  },{
    timestamps: true
  });

  

export const Order = model('Order', orderSchema);