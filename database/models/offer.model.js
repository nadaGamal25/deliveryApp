import mongoose, { Schema, model } from "mongoose"

const offerSchema = new Schema({
 
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  }, 
    status:{
      type:String,
      default:'waiting'
    },
  orderId: {
    type:mongoose.Types.ObjectId,
    ref:'Order',
    required:true
  },
  driverId: {
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
  },


  },{
    timestamps: true
  });

  

export const Offer = model('Offer', offerSchema);