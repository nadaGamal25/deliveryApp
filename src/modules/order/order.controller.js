import { Order } from "../../../database/models/order.model.js"
import { User } from "../../../database/models/user.model.js";
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add order
const addOrder=catchError(async(req,res,next)=>{
    if (req.files && req.files.orderImgs) {
        req.body.orderImgs = [];
        
        for (let img of req.files.orderImgs) {
            try {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'order', img.originalname);
                req.body.orderImgs.push(cloudinaryResult.secure_url);
            } catch (error) {
                console.error('Error uploading to Cloudinary', error);
                return next(new AppError('حدث خطأ فى تحميل الصور', 500));
            }
        }
    }
    let order=new Order(req.body)
    await order.save()
    await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $inc: { numberOfOrders: 1 } }  // Increment numberOfOrders by 1
    );
    res.status(200).json({message:"تمت الاضافة بنجاح", status:200,data:{order}})
})


// cancel order 
const cancelOrder = catchError(async (req, res, next) => {
    let order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new AppError("هذا الطلب غير موجود", 404));
    } else if (order.status === 'pending') {
        order.status = 'canceled';
        await order.save();  
        await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $inc: { numberOfOrders: -1 } } 
        );
        res.status(200).json({ message: "تم الالغاء بنجاح" , status:200,data:[]});
    } else {
        return next(new AppError("لا يمكن الغاء الطلب لان السائق ف الطريق اليك", 404));
    }
});


// get order by id
const getOrderById=catchError(async(req,res,next)=>{
    let order = await Order.findById(req.params.id);
    if (!order) {
        return next(new AppError('هذا الطلب غير موجود', 404));
    }else{
        res.status(200).json({message:'success', status:200,data:{order}})   
    }
})

// get order by status for client
const getOrderByStatus = catchError(async (req, res, next) => {
    let orders = await Order.find({
        status: req.query.status,
        clientId: req.user._id
    });

    if (orders.length === 0) {
        return next(new AppError('لا توجد طلبات بهذه الحالة', 404));
    } else {
        res.status(200).json({ message: 'success',  status:200,data:{orders} });
    }
});

// get orders  for client
const getOrdersForClient=catchError(async(req,res,next)=>{
    let orders = await Order.find({clientId:req.user._id});
    if (!orders) {
        return next(new AppError('هذا الطلب غير موجود', 404));
    }else{
        res.status(200).json({message:'success', status:200,data:{orders}})   
    }
})
// get orders  for driver
const getOrdersForDriver=catchError(async(req,res,next)=>{
    let orders = await Order.find({driverId:req.user._id});
    if (!orders) {
        return next(new AppError('هذا الطلب غير موجود', 404));
    }else{
        res.status(200).json({message:'success', status:200,data:{orders}})   
    }
})

// rate order 
const rateOrder = catchError(async (req, res, next) => {
    let order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new AppError("هذا الطلب غير موجود", 404));
    } else{
        order.rate = req.body.orderRate;
        await order.save();  
        res.status(200).json({ message: "تم " , status:200,data:{order}});
    } 
});

// change order status to recieved 
const recieveOrder = catchError(async (req, res, next) => {
    let order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new AppError("هذا الطلب غير موجود", 404));
    } else if (order.status === 'picked') {
        order.status = 'recieved';
        await order.save();  
        await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $inc: { numberOfOrders: 1 } } 
        );
        res.status(200).json({ message: "تم التأكيد بنجاح", status:200,data:[] });
    } else {
        return next(new AppError("لا يمكن تاكيد الطلب الان فانت لم تستلمه اولا", 404));
    }
});


export{
    addOrder,cancelOrder,getOrderById,getOrderByStatus,getOrdersForClient,getOrdersForDriver
    ,rateOrder,recieveOrder
}