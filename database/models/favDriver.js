import mongoose, { Schema, model } from "mongoose"

const favSchema = new Schema({
  
    driver: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    client:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    }
 
  },{
    timestamps: true
  });


// favSchema.pre(/^find/,function(){
//   this.populate('driver')
// })  
  

export const FavDriver = model('FavDriver', favSchema);