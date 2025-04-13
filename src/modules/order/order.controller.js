import { Order } from "../../../database/models/order.model.js"
import { User } from "../../../database/models/user.model.js";
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid'; // To ensure uniqueness
import crypto from 'crypto'; // For generating a random string
import mongoose from "mongoose";
import { Offer } from "../../../database/models/offer.model.js";
import { sendNotification } from "../../../public/js/firebase.js";
import { Notification } from "../../../database/models/notification.model.js";

//add order
const addOrder = catchError(async (req, res, next) => {
    try {
        // Handle image uploads to Cloudinary
        if (req.files?.orderImgs) {
            req.body.orderImgs = [];

            for (let img of req.files.orderImgs) {
                try {
                    const cloudinaryResult = await uploadToCloudinary(img.buffer, 'order', img.originalname);
                    req.body.orderImgs.push(cloudinaryResult.secure_url);
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    return next(new AppError('حدث خطأ فى تحميل الصور', 500));
                }
            }
        }

        // Create the order
        let order = new Order(req.body);
        order.qrCode = `https://end-order-page.vercel.app?id=${order._id}`;

        // Generate QR code
        try {
            const qrCodeDataURL = await QRCode.toDataURL(order.qrCode);
            const buffer = Buffer.from(qrCodeDataURL.split(",")[1], 'base64');
            const qrCodeUploadResult = await uploadToCloudinary(buffer, 'order', `${order._id}-qrcode.png`);
            order.qrCodeImg = qrCodeUploadResult.secure_url;
        } catch (error) {
            console.error('Error generating QR code:', error);
            return next(new AppError('حدث خطأ فى إنشاء QR code', 500));
        }

        // Save order after setting QR code image URL
        await order.save();

        // Increment user order count
        await User.findByIdAndUpdate(req.user._id, { $inc: { numberOfOrders: 1 } });

        res.status(200).json({ message: "تمت الاضافة بنجاح", status: 200, data: { order } });
    } catch (error) {
        console.error('Error in addOrder:', error);
        return next(new AppError('حدث خطأ أثناء إضافة الطلب', 500));
    }
});

// const addOrder=catchError(async(req,res,next)=>{
//     if (req.files && req.files.orderImgs) {
//         req.body.orderImgs = [];
        
//         for (let img of req.files.orderImgs) {
//             try {
//                 const cloudinaryResult = await uploadToCloudinary(img.buffer, 'order', img.originalname);
//                 req.body.orderImgs.push(cloudinaryResult.secure_url);
//             } catch (error) {
//                 console.error('Error uploading to Cloudinary', error);
//                 return next(new AppError('حدث خطأ فى تحميل الصور', 500));
//             }
//         }
//     }
     

//  // Generate a unique string for the QR code
//  const qrCodeString = crypto.randomBytes(5).toString('hex'); // Generates a 10-character unique string
//  req.body.qrCode = qrCodeString;

//  // Generate QR code image
//  try {
//      const qrCodeDataURL = await QRCode.toDataURL(qrCodeString); // Generate QR code as a Data URL
//      const buffer = Buffer.from(qrCodeDataURL.split(",")[1], 'base64'); // Extract the base64 part
//      const qrCodeUploadResult = await uploadToCloudinary(buffer, 'order', `${qrCodeString}-qrcode.png`); // Upload to Cloudinary
//      req.body.qrCodeImg = qrCodeUploadResult.secure_url; // Store the QR code image URL in the body
//  } catch (error) {
//      console.error('Error generating QR code', error);
//      return next(new AppError('حدث خطأ فى إنشاء QR code', 500));
//  }
 
//     let order=new Order(req.body)
//     await order.save()
//     await User.findByIdAndUpdate(
//         { _id: req.user._id },
//         { $inc: { numberOfOrders: 1 } },  // Increment numberOfOrders by 1
//     );
//     res.status(200).json({message:"تمت الاضافة بنجاح", status:200,data:{order}})
// })

// Generate a unique identifier for the order
    //  const uniqueId = uuidv4();
     // Generate the QR code for the order
    //  const qrCodeData = await QRCode.toDataURL(uniqueId);
    //  // Add the generated QR code and unique ID to the order body
    //  req.body.qrCode = qrCodeData;

// cancel order 
const cancelOrder = catchError(async (req, res, next) => {
    let order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new AppError("هذا الطلب غير موجود", 404));
    } else if (order.status === 'waiting') {
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
const cancelOrderByDriver = catchError(async (req, res, next) => {
    let ordery = await Order.findById(req.params.id);
    let title, body;
    const from=req.user._id
    const order=ordery._id
    let client = await User.findById(ordery.clientId);
    if (!ordery) {
        return next(new AppError("هذا الطلب غير موجود", 404));
    } else if (ordery.status === 'waiting') {
        await Offer.updateOne({ orderId: ordery._id,driverId:ordery.driverId ,status: "accepted" }, { status: "deleted" });
        await Offer.updateMany({ orderId: ordery._id, status: "ignored" }, { status: "waiting" });
        await Order.findByIdAndUpdate(ordery._id, { status: "waiting", $set: { driverId: null } });
        title = "تعطلت رحلتك";
        body = "تم الغاء الرحلة من قبل السواق ,يرجى اختيار عرض اخر."; 
        const sent = await sendNotification(client.fcmToken, title, body);
    if (sent) {
        await Notification.create({ userId: client._id, title, body ,from ,order });
    }
        res.status(200).json({ message: "تم الالغاء بنجاح" , status:200,data:[]});
    } else {
        return next(new AppError("لا يمكن الغاء الرحلة", 404));
    }
});


// get order by id
const getOrderById=catchError(async(req,res,next)=>{
    let order = await Order.findById(req.params.id)
    .populate({ path: 'clientPosition', select: 'name', strictPopulate: false })
    .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false })

    if (order.length === 0) {
        return res.status(200).json({
            message: 'لا توجد طلبات ',
            status: 200,
            data: { orders: [] }
        })
    }else{
        res.status(200).json({message:'success', status:200,data:{order}})   
    }
})

// get order by status for client
const getOrderByStatus = catchError(async (req, res, next) => {
    try {
        // Build the query to find orders by status and clientId
        let query = {
            status: req.query.status,
            clientId: req.user._id
        };

        // Base population for positions
        let populateArray = [
            { path: 'clientPosition', select: 'name', strictPopulate: false },
            { path: 'recieverPosition', select: 'name', strictPopulate: false }
        ];

        // Add population for driverId only if the status is "current" or "ended"
        // if (['current', 'ended'].includes(req.query.status)) {
        //     populateArray.push({
        //         path: 'driverId',
        //         populate: [
        //             { path: 'categoryId', select: 'name', strictPopulate: false },
        //             // { path: '', select: 'name', strictPopulate: false },
        //             { path: 'position', select: 'name', strictPopulate: false },
        //             {
        //                 path: '',
        //                 select: 'name',
        //                 strictPopulate: false,
        //               },
        //         ]
        //     });
        // }

        // Fetch orders and apply population
        let orders = await Order.find(query).populate(populateArray);

        if (orders.length === 0) {
            return res.status(200).json({
                message: 'لا توجد طلبات بهذه الحالة',
                status: 200,
                data: { orders: [] }
            });
        }

        return res.status(200).json({
            message: 'success',
            status: 200,
            data: { orders }
        });
    } catch (error) {
        console.error("Error in getOrderByStatus:", error);
        return res.status(500).json({
            message: error.message || 'Something went wrong',
            status: 500,
            data: []
        });
    }
});

// get waiting orderrs for driver 
const getWaitingOrders = catchError(async (req, res, next) => {
    try {
        // Build the query to find orders by status and clientId
        let query = {
            status: 'waiting', driverId: null
        };
        if (req.query.deliveryType) {
            query.deliveryType = req.query.deliveryType;
        }
        // Base population for positions
        let populateArray = [
            { path: 'clientPosition', select: 'name', strictPopulate: false },
            { path: 'recieverPosition', select: 'name', strictPopulate: false }
        ];

        // Fetch orders and apply population
        let orders = await Order.find(query).populate(populateArray);

        if (orders.length === 0) {
            return res.status(200).json({
                message: 'لا توجد طلبات بهذه الحالة',
                status: 200,
                data: { orders: [] }
            });
        }

        return res.status(200).json({
            message: 'success',
            status: 200,
            data: { orders }
        });
    } catch (error) {
        console.error("Error in getOrderByStatus:", error);
        return res.status(500).json({
            message: error.message || 'Something went wrong',
            status: 500,
            data: []
        });
    }
});

// get orders  for client
const getOrdersForClient=catchError(async(req,res,next)=>{
    let orders = await Order.find({clientId:req.user._id})
    .populate({ path: 'clientPosition', select: 'name', strictPopulate: false })
    .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false })

    if (orders.length === 0) {
        return res.status(200).json({
            message: 'لا توجد طلبات ',
            status: 200,
            data: { orders: [] }
        });
    }else{
        res.status(200).json({message:'success', status:200,data:{orders}})   
    }
})
// get orders  for driver
const getOrdersForDriver = catchError(async (req, res, next) => {
    // Construct the query dynamically
    const query = { driverId: req.user._id };
    if (req.query.status) {
        query.status = req.query.status;
    }

    // Find orders based on the query
    const orders = await Order.find(query)
        .populate({ path: 'clientPosition', select: 'name', strictPopulate: false })
        .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false });

    if (orders.length === 0) {
        return res.status(200).json({
            message: 'لا توجد طلبات ',
            status: 200,
            data: { orders: [] }
        });
    }

    res.status(200).json({
        message: 'success',
        status: 200,
        data: { orders }
    });
});


// rate order 
const rateOrder = catchError(async (req, res, next) => {
    let ordery = await Order.findById(req.params.id);
    const from=req.user._id
    const order=req.params.id
    let driver = await User.findById(ordery.driverId)
    let title="تم تقييم الرحلة من قبل العميل"
    let body= "اطلع على التقييم فى الطلبات السابقة لديك"
    if (!ordery) {
        return next(new AppError("هذا الطلب غير موجود", 404));
    } 

    if(ordery.isRated === true){
        return res.status(400).json({message:'تم تقييم الطلب من قبل',status:400,data:[]})
    }
    
        ordery.rate = req.body.orderRate;
        ordery.isRated = true;
        await ordery.save();  
       
        const sent = await sendNotification(driver.fcmToken, title, body);
    if (sent) {
        await Notification.create({ userId: driver._id, title, body ,from ,order });
    }
        res.status(200).json({ message: "تم تقييم الاوردر بنجاح " , status:200,data:{ordery}});
    
});

// change order status to ended 
const endOrder = catchError(async (req, res, next) => {
    let ordery = await Order.findOne({_id:req.params.id});
    const from="6736023f5583a031c9b8279f"
    const order=req.params.id
    let client = await User.findById(ordery.clientId)
    let driver = await User.findById(ordery.driverId)
    let title="تم انهاء رحلتك بنجاح"
    let body="شكراً لاستخدامك خدماتنا"
    if (!ordery) {
        return next(new AppError("هذا الطلب غير موجود", 404));
    } else if (ordery.status ==='ended'){
        return next(new AppError("لقد قمت بتأكيد الطلب من قبل", 404));
    }
    else if (ordery.status === 'current') {
        ordery.status = 'ended';
        await ordery.save();  
        await User.findByIdAndUpdate(
            { _id: ordery.driverId },
            { $inc: { numberOfOrders: 1 } } ,
            { $set: { available: true} }

        );
        const sent = await sendNotification(client.fcmToken, title, body);
        const sent2 = await sendNotification(driver.fcmToken, title, body);
    if (sent) {
        await Notification.create({ userId: client._id, title, body ,from ,order });
    }
    if (sent2) {
        await Notification.create({ userId: driver._id, title, body ,from ,order });
    }
        res.status(200).json({ message: "تم التأكيد بنجاح", status:200,data:[] });
    } else {
        return next(new AppError("لا يمكن تاكيد الطلب قبل بدء الرحلة", 404));
    }
});


export{
    addOrder,cancelOrder,getOrderById,getOrderByStatus,getOrdersForClient,getOrdersForDriver
    ,rateOrder,endOrder,getWaitingOrders,cancelOrderByDriver
}