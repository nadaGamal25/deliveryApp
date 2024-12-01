import Joi from 'joi';


const confirmUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const blockUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const invalidUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})
export{
    confirmUserVal,blockUserVal,invalidUserVal
}