import Joi from 'joi'

const addCategoryVal=Joi.object({
    name:Joi.string().min(1).max(50).required(),
    img:Joi.string(),
})



const deleteCategoryVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

export{
    addCategoryVal,deleteCategoryVal
}