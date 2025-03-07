import { Schema, model } from "mongoose";

const schema = new Schema({
    content: { type: String, required: true }, // Stores the full privacy policy text
    effectiveDate: { type: Date, default: Date.now },

  },{
    timestamps: true
  });


export const PrivacyPolicy = model('PrivacyPolicy', schema);