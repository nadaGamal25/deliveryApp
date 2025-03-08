import { Schema, model } from "mongoose";

const schema = new Schema({
  duration: {
    type: String,
    default:"شهرى"
  },
  type: {
    type: String,
    default:"persons",
    enum:["persons","schools"]
  },
  goTime: {
    type: String,
    required: true,
  },
  returnTime: {
    type: String,
    required: true,
  },
  startingPlace: {
    type: String,
    required: true,
  },
  goPlace: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
    default:0
  },
  status:{
    type:String,
    default:"pending"
  },
   
   
 
  },{
    timestamps: true
  });


export const Subscription = model('Subscription', schema);