import Joi from 'joi'

const addOfferVal=Joi.object({
    description:Joi.string().min(3).required(),
    price:Joi.number().min(1).required(),
    status:Joi.string(),
    orderId:Joi.string().hex().length(24).required(),
    userId:Joi.string().hex().length(24).required(),
})

const deleteOfferVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const getOffersByOrderIdVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const getOffersByUserIdVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

const changeOfferStatusVal=Joi.object({
    status:Joi.string().required(),
    id:Joi.string().hex().length(24).required(),
})

export{
    addOfferVal,deleteOfferVal,getOffersByOrderIdVal,getOffersByUserIdVal,changeOfferStatusVal
}