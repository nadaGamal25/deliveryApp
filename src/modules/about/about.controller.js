import { About } from "../../../database/models/aboutus.model.js"
import { catchError } from "../../middleware/catchError.js"
import {AppError} from "../../utils/appError.js"

const addAbout = catchError(async (req, res, next) => {
    // Log the request body to debug
    // console.log('Received body:', req.body);

    // Check if the `about` field is present and properly parsed
    if (!req.body || typeof req.body !== 'string') {
        return res.status(400).json({ message: '"about" content is required and must be a string', status: 400, data: [] });
    }

    // Create and save the `About` document
    const aboutContent = req.body; // assuming `req.body` contains the HTML string directly
    let about = new About({ about: aboutContent });

    try {
        await about.save();
        res.status(200).json({ message: "تمت اضافة النص", status: 200, data: { about } });
    } catch (error) {
        console.error('Error saving About content:', error);
        res.status(500).json({ message: 'Internal Server Error', status: 500, data: [] });
    }
});

 
const updateAbout=catchError(async(req,res,next)=>{
    let about=await About.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    about || next(new AppError("لا يوجد نص",404))
    !about || res.status(200).json({message:"تم تعديل النص",status:200,data:{about}})
})

const deleteAbout=catchError(async(req,res,next)=>{
    let about=await About.findOneAndDelete({_id:req.params.id})
    about || next(new AppError("لا يوجد نص",404))
    !about || res.status(200).json({message:"تم حذف النص",status:200,data:[]})
})

const getAbout=catchError(async(req,res,next)=>{
    let about=await About.find()
    res.status(200).json({message:"success",status:200,data: about })
})


export{
    addAbout,updateAbout,deleteAbout,getAbout
}