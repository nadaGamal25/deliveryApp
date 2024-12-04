import mongoose, { Schema, model } from "mongoose"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
dotenv.config();
const baseUrl = process.env.BASE_URL

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  }, 
  phone: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth:{
    type:Date,
    required:true
  },
  age:{
    type:Number,
  },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    position: {
      type:mongoose.Types.ObjectId,
      ref:'Position',
  },
  village: {
    type: mongoose.Schema.Types.Mixed, // Allows both ObjectId and String
    default: "",
    set: function (value) {
      // If it's a valid ObjectId, keep it; otherwise, set it to an empty string
      return mongoose.isValidObjectId(value) ? value : "";
    },
  },
    address:{
      type:String,
      required:true
    },
    urlLocation:{
      type:String,
    },
    positionLocation:{
      type:String,
    },
    role: {
      type: String,
      enum:['admin','driver','client'],
      required: true,
    },
    numberOfOrders:{
      type:Number,
      default:0,
    },
    wallet:{
      type:Number,
      default:0,
    },
    numberOfConnect:{
      type:Number,
      default:0,
    },
    categoryId: {
      type:mongoose.Types.ObjectId,
      ref:'Category',
  
  },
  vehiclesImgs:{
    type:[String]
  },
  isConfirmed:{
    type: Boolean,
    default: false,
  },
  isBlocked:{
    type: Boolean,
    default: false,
  },
  isValid:{
    type: Boolean,
    default: true,
  },
  available:{
    type: Boolean,
    default: true,
  },
  rateAvg:{
    type:Number,
    min:0,
    max:5,
    default:0
},
  rateCount:{
    type:Number,
    default:0
},
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  profileImg:{
    type:String,
  },
    passwordChangedAt:Date,  
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
    description:{
      type:String,
    },
    vehicleColor:{
      type:String,
    },
    vehicleNumber:{
      type:String,
      },
    vehicleType:{
      type:String,
    },

  },{
    timestamps: true
  });

  userSchema.virtual('myReviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'driver',
    justOne: false, // Ensure this is false to get an array of reviews
  });
  userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

   
  // userSchema.pre(/^find/, function(next) {
  //   this.populate('myReviews');
  //   next();
  // });
  
  
  userSchema.pre('save', function (next) {
    // Hash the password
    this.password = bcrypt.hashSync(this.password, 8);
  
    // Calculate the age
    if (this.dateOfBirth) {
      const currentDate = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  
      // Adjust age if the current month is before the birth month or if it's the birth month but the current day is before the birth day
      if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
      }
  
      this.age = age;
    }
  
    next();
  });

userSchema.pre('findOneAndUpdate',function(){
  if (this._update.password)  this._update.password=bcrypt.hashSync(this._update.password,8)
})

// userSchema.post('init',function(doc){
//   doc.vehiclesImgs =doc.vehiclesImgs.map(img=> `${baseUrl}/uploads/user/`+img);


// })  
  

export const User = model('User', userSchema);