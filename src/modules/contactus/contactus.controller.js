import { Contactus } from "../../../database/models/contactus.model.js"
import { catchError } from "../../middleware/catchError.js"

const addMsgContact=catchError(async(req,res,next)=>{
    let msg=new Contactus(req.body)
    await msg.save()
    res.status(200).json({message:"تم وصول رسالتك",status:200,data:{msg}})
})
 
const allmsgsContact=catchError(async(req,res,next)=>{
    let msg=await Contactus.find()
    res.status(200).json({message:"success",status:200,data:{msg}})
})



export {
    addMsgContact,allmsgsContact
}
