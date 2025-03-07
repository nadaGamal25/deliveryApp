import { Schema, model } from "mongoose";

const schema = new Schema({
  time: {
      type: String,
      required: true,
    }, 
  emptySeats:{
    type: Number,
    required: true,
  },
  place:{
    type:String,
    default:"beni suef"
  }
   
   
 
  },{
    timestamps: false ,versionKey:false
  });


export const SubReturnTime = model('SubReturnTime', schema);