import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    comment: {
      type: String,
    }, 
    rate: {
      type: Number,
      min: 0,
      max: 5,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   
 
  },{
    timestamps: true
  });


export const ReviewApp = model('ReviewApp', reviewSchema);