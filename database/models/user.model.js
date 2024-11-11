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
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    // confirmPassword: {
    //   type: String,
    //   required: true
    // },
    position: {
      type:mongoose.Types.ObjectId,
      ref:'Position',
  },
    village:{
      type:mongoose.Types.ObjectId,
      ref:'Village',
  },
    address:{
      type:String,
      required:true
    },
    urlLocation:{
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
  rateAvg:{
    type:Number,
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
    resetPasswordExpires: Date
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

   
  userSchema.pre(/^find/, function(next) {
    this.populate('myReviews');
    next();
  });
  
  
userSchema.pre('save',function(){
  this.password=bcrypt.hashSync(this.password,8)
})

userSchema.pre('findOneAndUpdate',function(){
  if (this._update.password)  this._update.password=bcrypt.hashSync(this._update.password,8)
})

// userSchema.post('init',function(doc){
//   doc.vehiclesImgs =doc.vehiclesImgs.map(img=> `${baseUrl}/uploads/user/`+img);


// })  
  

export const User = model('User', userSchema);