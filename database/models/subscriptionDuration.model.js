import { Schema, model } from "mongoose";

const schema = new Schema({
  duration: {
      type: String,
      required: true,
    }, 
    price:{
      type:Number,
      required:true
    }
   
   
 
  },{
    timestamps: false ,versionKey:false
  });


export const SubscriptionDuration = model('SubscriptionDuration', schema);