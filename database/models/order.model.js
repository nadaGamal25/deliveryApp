import mongoose, { Schema, model } from "mongoose"

const orderSchema = new Schema({
  clientAddress: {
    type: String,
    required: true,
  }, 
  recieverAddress: {
    type: String,
    // required: true,
    default:"",
  },
  clientPosition: {
    type:mongoose.Types.ObjectId,
    ref:'Position',
    // required: true,
    default:null,
  },  
  recieverPosition: {
    type:mongoose.Types.ObjectId,
    ref:'Position',
    // required: true,
    default:null,
  },
  clientName: {
    type: String,
    required: true,
  }, 
  recieverName: {
    type: String,
    default:""
  },
  clientPhone: {
    type: String,
    required: true,
  }, 
  recieverPhone: {
    type: String,
    default:""
  },
    goDate: {
      type: Date,
      default: Date.now,
      // required: true,
    },
    nums: {
      type: Number,
      default:0,
      // required: true,
    },
    price: {
      type: Number,
      default:0,
      // required: true,
    },
    type:{
      type:String,
      default:"",
      // required:true
    },
    goTime:{
      type:String,
      default:"",
      // required:true
    },
    waitingTime:{
      type:String,
      default:""
    },
    notes:{
      type:String,
      default:""
    },
    status:{
      type:String,
      default:'waiting'
    },
    rate:{
      type:Number,
      default:0
    },
    isRated:{
      type:Boolean,
      default:false
    },
    isTips:{
      type:Boolean,
      default:false
      // required:true
    },
    orderImgs:{
      type:[String],
      default:[]
    },
  driverId: {
    type:mongoose.Types.ObjectId,
    ref:'User',
    default:null,
  },
  clientId: {
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
  },
  qrCode:{
    type:String,
    default:""
  },
  qrCodeImg:{
    type:String,
    default:""
  },
  deliveryType:{
    type:String,
    default:"",
    enum:['persons','things','special'],
  },
  payType:{
    type:String,
    default:"cash",
  },
  isUrgent:{
    type:Boolean,
    default:false
  },
  shopping: [
    {
      store: { type: String ,default: ""}, // Store name
      products: [
        {
          name: { type: String ,default: "" }, // Product name
          quantity: { type: Number ,default: "" }, // Product quantity
        },
      ],
    },
  ],
},{
    timestamps: true
  });

  

export const Order = model('Order', orderSchema);