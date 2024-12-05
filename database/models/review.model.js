import mongoose, { Schema, model } from "mongoose"
import { User } from "./user.model.js";

const reviewSchema = new Schema({
    comment: {
      type: String,
      default:""
    }, 
    rate: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
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




reviewSchema.pre(/^find/,function(){
  this.populate('client','name profileImg')
})  
  

reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRating(this.driver);
});

// reviewSchema.post('findOneAndDelete', async function() {
//   await this.constructor.calcAverageRating(this.driver);
// });
reviewSchema.post('findOneAndDelete', async function(doc) {
  try {
    if (doc) {
      await doc.constructor.calcAverageRating(doc.driver);
    }
  } catch (error) {
    console.error('Error in calcAverageRating:', error);
  }
});


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
reviewSchema.statics.calcAverageRating = async function(driverId) {
  const stats = await this.aggregate([
    { $match: { driver: driverId } },
    {
      $group: {
        _id: '$driver',
        rateCount: { $sum: 1 },
        rateAvg: { $avg: '$rate' }
      }
    }
  ]);

  if (stats.length > 0) {
    // Round the average to the nearest integer and clamp it between 0 and 5
    const roundedRateAvg = Math.min(5, Math.max(0, Math.round(stats[0].rateAvg)));

    await User.findByIdAndUpdate(driverId, {
      rateCount: stats[0].rateCount,
      rateAvg: roundedRateAvg
    });
  } else {
    // Set rateAvg to 0 and rateCount to 0 if no reviews exist
    await User.findByIdAndUpdate(driverId, {
      rateCount: 0,
      rateAvg: 0
    });
  }
};

export const Review = model('Review', reviewSchema);