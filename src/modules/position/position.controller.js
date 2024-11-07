import { Position } from "../../../database/models/position.model.js";
import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add Position
const addPosition=catchError(async(req,res,next)=>{
    let position=new Position(req.body)
    await position.save()
    res.status(200).json({message:"تمت الاضافة بنجاح", status:200,data:{position}})
})


// delete Position 
const deletePosition = catchError(async (req, res, next) => {
    let document = await Position.findById(req.params.id);
    if (!document) {
        return next(new AppError("المنطقة غير موجودة", 404));
    }
    await Position.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم الحذف بنجاح" , status:200,data:[] });
});

//get positions
const getPositions=catchError(async(req,res)=>{
    let positions = await Position.find();
    if (!positions) {
        return next(new AppError('لا يوجد مناطق', 404));
    }
    res.status(200).json({message:'success', status:200,data:{positions}})   
})





export{
    addPosition,deletePosition,getPositions
}