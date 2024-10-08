import Joi from 'joi'

const addOrderVal=Joi.object({
    clientAddress:Joi.string().min(5).required(),
    recieverAddress:Joi.string().min(1).required(),
    goDate:Joi.date().required(),
    nums:Joi.number().required(),
    type:Joi.string().required(),
    goTime:Joi.string().min(1).required(),
    notes:Joi.string(),
    isTips:Joi.boolean().required(),
    clientId:Joi.string().hex().length(24).required(),
    orderImgs:Joi.array().items().min(0),
})

const cancelOrderVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    
})

const getOrderByIdVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    
})

const getOrderByStatusVal=Joi.object({
    status:Joi.string().required(),
})

const rateOrderVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    orderRate:Joi.number().min(0).max(5).required(),
})

const recieveOrderVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

export{
    addOrderVal,cancelOrderVal,getOrderByIdVal,getOrderByStatusVal,
    rateOrderVal,recieveOrderVal
}