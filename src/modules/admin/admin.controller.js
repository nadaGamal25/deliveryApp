import { User } from "../../../database/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
import dotenv from 'dotenv';
import { Order } from "../../../database/models/order.model.js";
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

        // Handle profile image upload
        if (req.files && req.files.profileImg && req.files.profileImg[0]) {
            const cloudinaryResult = await uploadToCloudinary(req.files.profileImg[0].buffer, 'user', req.files.profileImg[0].originalname);
            req.body.profileImg = cloudinaryResult.secure_url;
        }
        if (req.files && req.files.idCardImg && req.files.idCardImg[0]) {
            const cloudinaryResult = await uploadToCloudinary(req.files.idCardImg[0].buffer, 'user', req.files.idCardImg[0].originalname);
            req.body.idCardImg = cloudinaryResult.secure_url;
        }
        if (req.files && req.files.licenseImg && req.files.licenseImg[0]) {
            const cloudinaryResult = await uploadToCloudinary(req.files.licenseImg[0].buffer, 'user', req.files.licenseImg[0].originalname);
            req.body.licenseImg = cloudinaryResult.secure_url;
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
        return next(new AppError('حدث خطأ أثناء تعديل البيانات', 500));
    }
});

//get orders
const getOrders = catchError(async(req,res,next)=>{
    let order = await Order.find()
    .populate({ path: 'clientPosition', select: 'name', strictPopulate: false })
    .populate({ path: 'recieverPosition', select: 'name', strictPopulate: false })
    .populate({ path: 'driverId', select: 'name -_id', strictPopulate: false})
    .populate({ path: 'clientId', select: 'name -_id', strictPopulate: false})

    if (!order) {
        return next(new AppError('لا يوجد', 404));
    }else{
        res.status(200).json({message:'success', status:200,data:{order}})   
    }
})

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


export{
    confirmUser,blockUser,invalidUser,getClients,updateUser,getOrders,getUsersOrderedOrders,updateWallet,
    deleteUser
}