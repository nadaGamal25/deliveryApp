import Joi from 'joi'

const addVillageVal=Joi.object({
    name:Joi.string().min(1).max(50).required(),
})



const deleteVillageVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})



export{
    addVillageVal,deleteVillageVal
}