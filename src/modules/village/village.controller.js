import { User } from "../../../database/models/user.model.js";
import { Village } from "../../../database/models/village.model.js";
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add Village
const addVillage=catchError(async(req,res,next)=>{
  
    let village=new Village(req.body)
    await village.save()
    res.status(200).json({message:"تمت الاضافة بنجاح",village})
})


// delete Village 
const deleteVillage = catchError(async (req, res, next) => {
    let document = await Village.findById(req.params.id);
    if (!document) {
        return next(new AppError("القرية غير موجودة", 404));
    }
    await Village.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم الحذف بنجاح" });
});

//get village
const getVillage=catchError(async(req,res)=>{
    let village = await Village.find();
    if (!village) {
        return next(new AppError('لا يوجد قرى', 404));
    }
    res.status(200).json({message:'success',village})   
})





export{
    addVillage,deleteVillage,getVillage
}