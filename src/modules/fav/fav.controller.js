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
    let fav=await FavDriver.find({driver:req.params.id}).populate('client','name')
    fav || next(new AppError("لا يوجد تقييم",404))
    !fav || res.status(200).json({message:"success",status:200,data:{fav}})
})

const getFavClient = catchError(async (req, res, next) => {
    let fav = await FavDriver.find({ client: req.params.id })
    .populate({
        path: 'driver',
        // select: 'name age profileImg categoryId rateAvg position',
        populate: [
            { 
                path: 'categoryId', // Populates the `categoryId` field within `driver`
                select: 'name', // Selects only the `name` field from the `Category` model
                strictPopulate: false
            },
            {
                path: 'position', // Populates the `position` field within `driver`
                select: 'name', // Selects only the `name` field from the `Position` model
                strictPopulate: false
            }
        ]
    })

    if (!fav) {
        return next(new AppError("لا يوجد تقييم", 404));
    }

    // Remove the `client` field from the fav before sending the response
    // fav = fav.toObject();
    // delete fav.client;

    res.status(200).json({ message: "success", status: 200, data: { fav } });
});


export{
    addFav,allFav,getFavDriver,deleteFav,getFavClient
}