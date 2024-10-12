import Joi from 'joi'

const addPositionVal=Joi.object({
    name:Joi.string().min(1).max(50).required(),
})



const deletePositionVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})


export{
    addPositionVal,deletePositionVal
}