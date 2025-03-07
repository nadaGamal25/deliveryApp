import { Schema, model } from "mongoose";

const schema = new Schema({
  name: {
      type: String,
      required: true,
    }, 
   
   
 
  },{
    timestamps: false ,versionKey:false
  });


export const SubStartingPlace = model('SubStartingPlace', schema);