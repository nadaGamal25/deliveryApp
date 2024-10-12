import mongoose, { Schema, model } from "mongoose"


const villageSchema = new Schema({
    name: {
      type: String,
      required: true,
    }
 
  },{
    timestamps: true
  });


export const Village = model('Village', villageSchema);