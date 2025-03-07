import Joi from "joi";

const addSubDurationVal = Joi.object({
    duration: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    price:Joi.number().required().messages({
        'number.empty': ' مطلوب',
        'any.required': ' مطلوب'

    })
});

const updateSubDurationVal = Joi.object({
    duration: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    price:Joi.number().messages({
        'number.empty': ' مطلوب',
        'any.required': ' مطلوب'

    }),
    id: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً"
    })
});

const deleteSubDurationVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});



export{
    addSubDurationVal,
    updateSubDurationVal,
    deleteSubDurationVal,
    
}