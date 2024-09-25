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
    position:{
      type:String,
      required:true
    },
    village:{
      type:String,
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
      enum:['admin','user','client'],
      default: 'user',
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
  //   category: {
  //     type:mongoose.Types.ObjectId,
  //     ref:'Category',
  // },
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
    passwordChangedAt:Date,  
    resetPasswordOTP: String,
    resetPasswordExpires: Date
  },{
    timestamps: true
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