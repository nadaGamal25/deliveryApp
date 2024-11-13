import { Schema, model } from "mongoose";

const schema = new Schema({
    text: {
      type: String,
    }, 
   
   
 
  },{
    timestamps: true
  });


export const About = model('About', schema);