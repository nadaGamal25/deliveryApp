import { SubMovingTime } from "../../../database/models/subMovingTime.model.js";
import { SubReturnTime } from "../../../database/models/subReturnTime.model.js";
import { Subscription } from "../../../database/models/subscriptions.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addSubscriptions = catchError(async (req, res, next) => {
    req.body.clientId = req.user._id;

    // Handle goTime if provided
    if (req.body.goTime) {
        let movingTime = await SubMovingTime.findOne({ time: req.body.goTime ,place:req.body.goPlace});
        if (!movingTime) {
            return next(new AppError("الوقت المحدد للذهاب غير متوفر", 400));
        }
        if (movingTime.emptySeats <= 0) {
            return next(new AppError("لا توجد مقاعد فارغة لهذا الوقت", 400));
        }
        await SubMovingTime.findByIdAndUpdate(movingTime._id, { $inc: { emptySeats: -1 } });
    }

    // Handle returnTime if provided
    if (req.body.returnTime) {
        let returnTime = await SubReturnTime.findOne({ time: req.body.returnTime });
        if (!returnTime) {
            return next(new AppError("الوقت المحدد للعودة غير متوفر", 400));
        }
        if (returnTime.emptySeats <= 0) {
            return next(new AppError("لا توجد مقاعد فارغة لهذا الوقت", 400));
        }
        await SubReturnTime.findByIdAndUpdate(returnTime._id, { $inc: { emptySeats: -1 } });
    }

    // Add new subscription
    let subscriptions = new Subscription(req.body);
    await subscriptions.save();

    res.status(200).json({ message: "تمت الإضافة بنجاح", status: 200, data: { subscriptions } });
});

  
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
const getsubscriptions = catchError(async (req, res, next) => {
    // Build query object
    const query = {};

    if (req.query.type) query.type = req.query.type;
    if (req.query.duration) query.duration = req.query.duration;
    if (req.query.goTime) query.goTime = req.query.goTime;
    if (req.query.returnTime) query.returnTime = req.query.returnTime;
    if (req.query.startingPlace) query.startingPlace = req.query.startingPlace;
    if (req.query.goPlace) query.goPlace = req.query.goPlace;
    if (req.query.status) query.status = req.query.status;

    // Fetch filtered subscriptions
    let subscriptions = await Subscription.find(query).populate(
        'clientId',
        'name phone'
    ).populate({ path: 'position', select: 'name', strictPopulate: false })

    res.status(200).json({ message: "success", status: 200, data: { subscriptions } });
});

const getsubscriptionsForClient = catchError(async (req, res, next) => {
    let subscriptions = await Subscription.find({
        clientId: req.user._id,
        status: { $ne: "canceled" } // Exclude canceled subscriptions
    }).populate({ path: 'position', select: 'name', strictPopulate: false })

    res.status(200).json({ message: "success", status: 200, data: { subscriptions } });
});





export{
    addSubscriptions,updateSubscriptions,getsubscriptions,cancelSubscription,getsubscriptionsForClient
}