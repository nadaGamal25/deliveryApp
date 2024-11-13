import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  phone: {
    type: String,
  },
  email: {
      type: String,
    },
  pages:{
      type:[String]
    }
   
 
  },{
    timestamps: true
  });


export const Social = model('Social', schema);