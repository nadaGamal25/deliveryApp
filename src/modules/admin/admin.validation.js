import Joi from 'joi';


const confirmUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()
})

const blockUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()

})

const invalidUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()

})
const highlightUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()

})
export{
    confirmUserVal,blockUserVal,invalidUserVal,highlightUserVal
}