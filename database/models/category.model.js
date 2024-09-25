import mongoose, { Schema, model } from "mongoose"


const categorySchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true
    }, 
    img: {
      type: String,
    },
  
 
  },{
    timestamps: true
  });


export const Category = model('Category', categorySchema);