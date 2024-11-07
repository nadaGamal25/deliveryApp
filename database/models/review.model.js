import mongoose, { Schema, model } from "mongoose"
import { User } from "./user.model.js";

const reviewSchema = new Schema({
    comment: {
      type: String,
    }, 
    rate: {
      type: Number,
      min: 0,
      max: 5,
    },
    driver:{
      type:mongoose.Types.ObjectId,
      ref:'User',
      required:true
    },
    client:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    }
 
  },{
    timestamps: true
  });




reviewSchema.pre(/^find/,function(){
  this.populate('client','name')
})  
  

// reviewSchema.post('save', async function() {
//   await this.constructor.calcAverageRating(this.driver);
// });

// reviewSchema.post('findOneAndDelete', async function() {
//   await this.constructor.calcAverageRating(this.driver);
// });

// reviewSchema.statics.calcAverageRating = async function(driverId) {
//   const stats = await this.aggregate([
//     { $match: { driver: driverId } },
//     {
//       $group: {
//         _id: '$driver',
//         rateCount: { $sum: 1 },
//         rateAvg: { $avg: '$rate' }
//       }
//     }
//   ]);

//   if (stats.length > 0) {
//     await User.findByIdAndUpdate(driverId, {
//       rateCount: stats[0].rateCount,
//       rateAvg: stats[0].rateAvg
//     });
//   } else {
//     await User.findByIdAndUpdate(driverId, {
//       rateCount: 0,
//       rateAvg: 0
//     });
//   }
// };

export const Review = model('Review', reviewSchema);