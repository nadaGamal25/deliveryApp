import mongoose from "mongoose";
import { User } from "../../../database/models/user.model.js";
import { Village } from "../../../database/models/village.model.js";
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add Village
const addVillage=catchError(async(req,res,next)=>{
  
    let village=new Village(req.body)
    await village.save()
    res.status(200).json({message:"تمت الاضافة بنجاح", status:200,data:{village}})
})


// delete Village 
const deleteVillage = catchError(async (req, res, next) => {
    let document = await Village.findById(req.params.id);
    if (!document) {
        return next(new AppError("القرية غير موجودة", 404));
    }
    await Village.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم الحذف بنجاح" , status:200,data:[] });
});

//get village
const getVillage = catchError(async (req, res, next) => {
    const prioritizedId = "675068dd3f3723057f53b24e"; // The ID to prioritize

    let village = await Village.aggregate([
        // First stage: Match the document with the prioritized ID
        { $match: { _id: new mongoose.Types.ObjectId(prioritizedId) } },
        // Second stage: Union with the remaining documents
        {
            $unionWith: {
                coll: "villages", // Replace with your actual collection name if necessary
                pipeline: [
                    { $match: { _id: { $ne: new mongoose.Types.ObjectId(prioritizedId) } } } // Exclude prioritized document
                ]
            }
        }
    ]);

    if (!village || village.length === 0) {
        return next(new AppError('لا يوجد قرى', 404));
    }

    res.status(200).json({ message: 'success', status: 200, data: { village } });
});




export{
    addVillage,deleteVillage,getVillage
}