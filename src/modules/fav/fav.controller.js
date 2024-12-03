import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"
import { FavDriver } from "../../../database/models/favDriver.js"

const addFav=catchError(async(req,res,next)=>{
    req.body.client=req.user._id
    // let isExist=await FavDriver.findOne({client:req.user._id, driver:req.body.driver})
    // if(isExist) return next(new AppError("لقد قمت بتقييم هذا السائق من قبل",409))
    let fav=new FavDriver(req.body)
    await fav.save()
    res.status(200).json({message:"تمت الاضافة للمفضلة",status:200,data:{fav}})
})


const deleteFav=catchError(async(req,res,next)=>{
    let fav=await FavDriver.findOneAndDelete({_id:req.params.id})
    fav || next(new AppError("لا يوجد تقييم",404))
    !fav || res.status(200).json({message:"تم الحذف من المفضلة",status:200,data:[]})
})

const allFav=catchError(async(req,res,next)=>{
    let fav=await FavDriver.find().populate('client').populate('driver')
    res.status(200).json({message:"success",status:200,data:{fav}})
})

const getFavDriver=catchError(async(req,res,next)=>{
    let users=await usersDriver.find({driver:req.params.id}).populate('client','name profileImg')
    users || next(new AppError("لا يوجد تقييم",404))
    !users || res.status(200).json({message:"success",status:200,data:{users}})
})

const getFavClient = catchError(async (req, res, next) => {
    let users = await FavDriver.find({ client: req.params.id })
        .populate({
            path: 'driver',
            populate: [
                { 
                    path: 'categoryId',
                    select: 'name',
                    strictPopulate: false
                },
                {
                    path: 'position',
                    select: 'name',
                    strictPopulate: false
                }
            ]
        });

    if (!users || users.length === 0) {
        return next(new AppError("لا يوجد تقييم", 404));
    }

    // Transform the data into the desired format
    const transformedUsers = users.map(user => {
        if (!user.driver) return null; // Skip if driver is missing
        const driver = user.driver.toObject(); // Convert Mongoose document to plain object
        return {
            _id: user._id,
            driverId: driver._id,
            ...driver, // Spread all properties of the driver
            client: user.client,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            __v: user.__v
        };
    }).filter(Boolean); // Remove null values

    res.status(200).json({
        message: "success",
        status: 200,
        data: { users: transformedUsers }
    });
});


export{
    addFav,allFav,getFavDriver,deleteFav,getFavClient
}