import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  question: {
    type: String,
    required: true,
  }, 
  answer: {
    type: String,
    required: true,
  },
  
 
  },{
    timestamps: true
  });


export const QandA = model('QandA', schema);