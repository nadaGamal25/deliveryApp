import { User } from "../../../database/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
import dotenv from 'dotenv';
import { Order } from "../../../database/models/order.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { Subscription } from "../../../database/models/subscriptions.model.js";
dotenv.config();
const secretKey = process.env.SECRET_KEY;


//confirm user
const confirmUser = catchError(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    if (user) {
        // Update the user and reassign the variable to the updated object
        user = await User.findByIdAndUpdate(req.params.id, { isConfirmed: req.body.value }, { new: true });
        if(req.body.value === true){
            res.status(200).json({ message: 'تم تأكيد الحساب بنجاح', status: 200, data: { user } });
        }
        else{
            res.status(200).json({ message: 'تم الغاء توثيق الحساب بنجاح', status: 200, data: { user } });
        }
        } else {
        return next(new AppError('المستخدم غير موجود', 400));
    }
});


//block user
const blockUser=catchError(async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    if(user){
        user= await User.findByIdAndUpdate(req.params.id, {isBlocked:req.body.value}, { new: true })
        if(req.body.value === true){
        res.status(200).json({message:'تم حظر الحساب بنجاح', status:200,data:{user}})
        }else{
            res.status(200).json({message:'تم الغاء حظر الحساب بنجاح', status:200,data:{user}})
        }
    }else{
        return next(new AppError(' المستخدم غير موجود',400))
    }
    
})

//highlight user
const highlightUser=catchError(async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    if(user){
        user= await User.findByIdAndUpdate(req.params.id, {isHighlighted:req.body.value}, { new: true })
        if(req.body.value === true){
        res.status(200).json({message:'تم تمييز الحساب بنجاح', status:200,data:{user}})
        }else{
            res.status(200).json({message:'تم الغاء تمييز الحساب بنجاح', status:200,data:{user}})
        }
    }else{
        return next(new AppError(' المستخدم غير موجود',400))
    }
    
})

//make user invalid
const invalidUser=catchError(async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    if(user){
        user= await User.findByIdAndUpdate(req.params.id, {isValid:req.body.value}, { new: true })
        if(req.body.value === false){
        res.status(200).json({message:'تم تعطيل المستخدم بنجاح', status:200,data:{user}})
        }else{
            res.status(200).json({message:'تم تفعيل المستخدم بنجاح', status:200,data:{user}})
        }
    }else{
        return next(new AppError(' المستخدم غير موجود',400))
    }
    
})


//get clients
const getClients = catchError(async (req, res, next) => {
    const { position, age, phone, name } = req.query;

    // Build the query object dynamically
    let query = { role: 'client' };

    if (position) {
        query['position'] = position; // Assumes `position` is an ID
    }
    if (age) {
        query['age'] = { $gte: parseInt(age, 10) }; // Filter for minimum age
    }
    if (phone) {
        query['phone'] = phone; 
    }
    if (name) {
        query['name'] = name;
    }
   
    // Execute the query with the appropriate population
    let users = await User.find(query)
        .populate({ path: 'position', select: 'name', strictPopulate: false })
        // .populate({ path: 'village', select: 'name', strictPopulate: false })

    if (!users || users.length === 0) {
        return next(new AppError('لم يتم العثور على المستخدمين', 404));
    }

    res.status(200).json({ message: 'success', status: 200, data: { users } });
});

//update user.
const updateUser = catchError(async (req, res, next) => {
    try {
        // Handle vehicles images upload
        if (req.files && req.files.vehiclesImgs) {
            req.body.vehiclesImgs = [];
            for (let img of req.files.vehiclesImgs) {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.vehiclesImgs.push(cloudinaryResult.secure_url);
            }
        }
        if (req.files && req.files.licenseVehicleImgs) {
            req.body.licenseVehicleImgs = [];
            for (let img of req.files.licenseVehicleImgs) {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.licenseVehicleImgs.push(cloudinaryResult.secure_url);
            }
        }

        // Handle profile image upload
        if (req.files && req.files.profileImg && req.files.profileImg[0]) {
            const cloudinaryResult = await uploadToCloudinary(req.files.profileImg[0].buffer, 'user', req.files.profileImg[0].originalname);
            req.body.profileImg = cloudinaryResult.secure_url;
        }
        
        if (req.files && req.files.idCardImg) {
            req.body.idCardImg = [];
            for (let img of req.files.idCardImg) {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.idCardImg.push(cloudinaryResult.secure_url);
            }
        }
        if (req.files && req.files.licenseImg) {
            req.body.licenseImg = [];
            for (let img of req.files.licenseImg) {
                const cloudinaryResult = await uploadToCloudinary(img.buffer, 'user', img.originalname);
                req.body.licenseImg.push(cloudinaryResult.secure_url);
            }
        }

        // Find the user
        let user = await User.findById(req.params.id);
        if (!user) {
            return next(new AppError('المستخدم غير موجود', 404));
        }

        // Update user data
        Object.assign(user, req.body); // Directly assign fields from req.body
        await user.save(); // Save changes to the database

        // Send response
        res.status(200).json({
            message: 'تم تعديل البيانات بنجاح',
            status: 200,
            data: { user },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return next(new AppError(error, 500));
    }
});

//get orders
const getOrders = catchError(async (req, res, next) => {
    const { page = 1, limit = 10, status, clientPositionId, recieverPositionId, clientName ,deliveryType } = req.query;

    // Base query
    let query = Order.find()
        .populate({ path: 'clientPosition', select: 'name', strictPopulate: false })
        .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false })
        .populate({ path: 'clientId', select: 'name', strictPopulate: false })
        .populate({ path: 'driverId', select: 'name', strictPopulate: false });

    // Filtering by status
    if (status) {
        query = query.find({ status });
    }
    if (deliveryType) {
        query = query.find({ deliveryType });
    }

    // Filtering by clientPositionId and recieverPositionId
    if (clientPositionId || recieverPositionId) {
        const positionFilter = {};
        if (clientPositionId) {
            positionFilter.clientPosition = clientPositionId;
        }
        if (recieverPositionId) {
            positionFilter.recieverPosition = recieverPositionId;
        }
        query = query.find(positionFilter);
    }

    // Filtering by client name (exact or partial match)
    if (clientName) {
        query = query.find({
            clientName: { $regex: clientName, $options: 'i' }, 
        });
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query.getQuery());
    const totalPages = Math.ceil(total / limit);

    query = query.skip(skip).limit(limit);

    // Execute the query
    const orders = await query;

    if (!orders || orders.length === 0) {
        return res.status(200).json({
            message: 'لا يوجد طلبات مطابقة',
            status: 200,
            data: [],
        });
    }

    res.status(200).json({
        message: 'success',
        status: 200,
        data: {
            page: +page,
            totalPages,
            total,
            orders,
        },
    });
});

//update order.
const updateOrder = catchError(async (req, res, next) => {
    try {
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
        // Find the order
        let order = await Order.findById(req.params.id);
        if (!order) {
            return next(new AppError(' غير موجود', 404));
        }

        // Update order data
        Object.assign(order, req.body); // Directly assign fields from req.body
        await order.save(); // Save changes to the database

        // Send response
        res.status(200).json({
            message: 'تم تعديل البيانات بنجاح',
            status: 200,
            data: { order },
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return next(new AppError(error, 500));
    }
});


//get users with number of orders ordered
const getUsersOrderedOrders = catchError(async (req, res, next) => {
    // Fetch users with roles "client" or "driver"
    const users = await User.find({ role: { $in: ['client', 'driver'] } })
        .select('name phone wallet numberOfOrders role') // Select only specific fields
        .sort({ numberOfOrders: -1 }); // Sort by numberOfOrders in descending order

    if (!users || users.length === 0) {
        return next(new AppError('لا يوجد مستخدمين', 404));
    }

    res.status(200).json({
        message: 'success',
        status: 200,
        data: { users },
    });
});

const updateWallet = catchError(async (req, res, next) => {
    const { wallet } = req.body;
    const { id } = req.params;

    if (wallet == null || isNaN(wallet)) {
        return next(new AppError('يرجى توفير مبلغ صالح للمحفظة', 400));
    }

    // Find the user by ID
    let user = await User.findById(id);
    if (!user) {
        return next(new AppError('المستخدم غير موجود', 404));
    }

    // Update the wallet amount
    user.wallet = wallet;
    await user.save();

    // Respond with the updated user
    res.status(200).json({
        message: 'تم تحديث المحفظة بنجاح',
        status: 200,
        data: {
            user: {
                name: user.name,
                phone: user.phone,
                wallet: user.wallet,
                numberOfOrders: user.numberOfOrders,
            },
        },
    });
});

const deleteUser=catchError(async(req,res,next)=>{
        let document=await User.findOneAndDelete({_id:req.params.id})
        document || next(new AppError("المستخدم غير موجود",404))
        !document || res.status(200).json({message:"تم الحذف بنجاح"})
    })


//confirm subscription
const confirmSubscription = catchError(async (req, res, next) => {
    // Find the subscription
    let sub = await Subscription.findById(req.params.id);
    if (!sub) {
        return next(new AppError("الاشتراك غير موجود", 404));
    }

    // Update subscription
    sub = await Subscription.findByIdAndUpdate(
        req.params.id,
        { $set: { price: req.body.price, status: "current" } },
        { new: true }
    );

    res.status(200).json({ 
        message: "تم تأكيد الاشتراك بنجاح", 
        status: 200, 
        data: { sub } 
    });
});


export{
    confirmUser,blockUser,invalidUser,getClients,updateUser,getOrders,getUsersOrderedOrders,updateWallet,
    deleteUser,highlightUser,updateOrder,confirmSubscription
}