import Joi from "joi";

const addSubGoPlaceVal = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    
});


const deleteSubGoPlaceVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});



export{
    addSubGoPlaceVal,
    deleteSubGoPlaceVal,
    
}