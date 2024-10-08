import mongoose, { Schema, model } from "mongoose"

const offerSchema = new Schema({
  description: {
    type: String,
    required: true,
  }, 
  price: {
    type: Number,
    required: true,
  },
    status:{
      type:String,
      default:'pending'
    },
  orderId: {
    type:mongoose.Types.ObjectId,
    ref:'Order',
    required:true
  },
  userId: {
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
  },


  },{
    timestamps: true
  });

  

export const Offer = model('Offer', offerSchema);