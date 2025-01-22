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
    default:0
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
    type: mongoose.Schema.Types.ObjectId, // ObjectId to reference the Village model
    ref: 'Village',  // Reference the Village model
    required: false, // Make it optional if it's not always populated
    default:"675068dd3f3723057f53b24e", // Set default value if empty
  },
  
  // village: {
  //   type: mongoose.Schema.Types.Mixed,
  //   default: "",
  //   set: function (value) {
  //     if (value === "") {
  //       return ""; // Return empty string if the value is empty
  //     }
  //     if (mongoose.isValidObjectId(value)) {
  //       return new mongoose.Types.ObjectId(value); // Convert to ObjectId if it's valid
  //     }
  //     return value; // Return as-is if it's not an empty string or valid ObjectId
  //   },
  //   validate: {
  //     validator: function (value) {
  //       // Validate if value is either an empty string or a valid ObjectId
  //       return value === "" || mongoose.isValidObjectId(value);
  //     },
  //     message: "Village must be a valid ObjectId or an empty string.",
  //   },
  // },  
    address:{
      type:String,
      required:true
    },
    urlLocation:{
      type:String,
      default:""

    },
    positionLocation:{
      type:String,
      default:""

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
    type:[String],
    default:[]
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
  // startTime: {
  //   type: String,
  //   default: '00:00',
  // },
  // endTime: {
  //   type: String,
  //   default: '23:59',
  // },
  profileImg:{
    type:String,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    set: function (value) {
      return value || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
    },
  },
  idCardImg:{
    type:String,
    default:""

  },
  licenseImg:{ 
    type:String,
    default:""

  },
    passwordChangedAt:Date,  
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
    description:{
      type:String,
      default:""
    },
    vehicleColor:{
      type:String,
      default:""

    },
    vehicleNumber:{
      type:String,
      default:""

      },
    vehicleType:{
      type:String,
      default:""

    },
    fcmToken: {
      type:String,
      default:""
    }, // Firebase Cloud Messaging Token
    online:{
      type:Boolean,
      default:true
    },
    isHighlighted:{
      type:Boolean,
      default:false
    },
    isFav:{
      type:Boolean,
      default:false
    }
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

  // userSchema.pre("save", function (next) {
  //   if (typeof this.village === "string" && mongoose.isValidObjectId(this.village)) {
  //     this.village = new mongoose.Types.ObjectId(this.village);
  //   }
  //   next();
  // });

userSchema.pre('findOneAndUpdate',function(){
  if (this._update.password)  this._update.password=bcrypt.hashSync(this._update.password,8)
})

// userSchema.post('init',function(doc){
//   doc.vehiclesImgs =doc.vehiclesImgs.map(img=> `${baseUrl}/uploads/user/`+img);


// })  
  

export const User = model('User', userSchema);