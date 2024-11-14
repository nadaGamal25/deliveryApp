import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true,
  }, 
  phone: {
    type: String,
    required: true,
    unique:false
  },
  comment: {
      type: String,
    }, 
    
 
  },{
    timestamps: true
  });


export const Contactus = model('Contactus', schema);