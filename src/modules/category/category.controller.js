import { Category } from "../../../database/models/category.model.js"
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js";
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"


//add category
const addCategory=catchError(async(req,res,next)=>{
    if (req.file) {
        // Upload image buffer to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, 'category', req.file.originalname);
        req.body.img = cloudinaryResult.secure_url; // Store Cloudinary URL in req.body
    }
    // if(req.file) req.body.img=req.file.path
    let category=new Category(req.body)
    await category.save()
    res.status(200).json({message:"تمت الاضافة بنجاح",category})
})


// delete category 
const deleteCategory = catchError(async (req, res, next) => {
    let document = await Category.findById(req.params.id);
    if (!document) {
        return next(new AppError("الفئة غير موجودة", 404));
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "تم الحذف بنجاح" });
});

//get categories
const getCategories=catchError(async(req,res)=>{
    let categories = await Category.find();
    if (!categories) {
        return next(new AppError('لا يوجد فئات', 404));
    }
    res.status(200).json({message:'success',categories})   
})



export{
    addCategory,deleteCategory,getCategories
}