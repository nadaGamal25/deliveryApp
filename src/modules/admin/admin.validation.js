import Joi from 'joi';


const confirmUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

export{
    confirmUserVal
}