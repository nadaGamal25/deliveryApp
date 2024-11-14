import { Schema, model } from "mongoose";

const schema = new Schema({
    about: {
      type: String, // Supports storing HTML content
      required: true,
    }, 
   
   
 
  },{
    timestamps: true
  });


export const About = model('About', schema);