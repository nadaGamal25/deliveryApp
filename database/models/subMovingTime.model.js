import { Schema, model } from "mongoose";

const schema = new Schema({
  time: {
      type: String,
      required: true,
    }, 
  emptySeats:{
    type: Number,
    required: true,
  }
   
   
 
  },{
    timestamps: false ,versionKey:false
  });


export const SubMovingTime = model('SubMovingTime', schema);