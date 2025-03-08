import { Subscription } from "../../../database/models/subscriptions.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSubscriptions=catchError(async(req,res,next)=>{
    let subscriptions=new Subscription(req.body)
    await subscriptions.save()
    res.status(200).json({message:"تمت الاضافة ",status:200,data:{subscriptions}})
})
  
const updateSubscriptions=catchError(async(req,res,next)=>{
    let subscriptions=await Subscription.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    subscriptions || next(new AppError("لا يوجد ",404))
    !subscriptions || res.status(200).json({message:"تم التعديل ",status:200,data:{subscriptions}})
})

const cancelSubscription = catchError(async (req, res, next) => {
    let sub = await Subscription.findById(req.params.id);
    
    if (!sub) {
        return next(new AppError(" غير موجود", 404));
    }
        sub.status = 'canceled';
        await sub.save();  
        
        res.status(200).json({ message: "تم الالغاء بنجاح" , status:200,data:[]});
   
});
const getsubscriptions=catchError(async(req,res,next)=>{
    let subscriptions=await Subscription.find()
    res.status(200).json({message:"success",status:200,data:{subscriptions}})
})



export{
    addSubscriptions,updateSubscriptions,getsubscriptions,cancelSubscription
}