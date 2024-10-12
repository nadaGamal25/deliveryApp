import mongoose, { Schema, model } from "mongoose"


const positionSchema = new Schema({
    name: {
      type: String,
      required: true,
    }
  
 
  },{
    timestamps: true
  });


export const Position = model('Position', positionSchema);