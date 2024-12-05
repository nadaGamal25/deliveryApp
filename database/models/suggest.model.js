import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    default:""
  }, 
  phone: {
    type: String,
    required: true,
    default:""
  },
    comment: {
      type: String,
      default:""
    }, 
    
 
  },{
    timestamps: true
  });


export const Suggest = model('Suggest', schema);