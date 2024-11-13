import { Suggest } from "../../../database/models/suggest.model.js"
import { catchError } from "../../middleware/catchError.js"

const addMsgSuggest=catchError(async(req,res,next)=>{
    let msg=new Suggest(req.body)
    await msg.save()
    res.status(200).json({message:"تم وصول رسالتك وسوف يتم الرد عليها فى اقرب وقت",status:200,data:{msg}})
})
 
const allmsgsSuggest=catchError(async(req,res,next)=>{
    let msg=await Suggest.find()
    res.status(200).json({message:"success",status:200,data:{msg}})
})



export {
    addMsgSuggest,allmsgsSuggest
}
