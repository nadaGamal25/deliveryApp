import Joi from "joi";

const addSubReturnTimeVal = Joi.object({
    time: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    emptySeats:Joi.number().required().messages({
        'number.empty': ' مطلوب',
        'any.required': ' مطلوب'

    }),
    place:Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    })
});

const updateSubReturnTimeVal = Joi.object({
    time: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    emptySeats:Joi.number().required().messages({
        'number.empty': ' مطلوب',
        'any.required': ' مطلوب'

    }),
    place:Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    id: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً"
    })
});

const deleteSubReturnTimeVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});



export{
    addSubReturnTimeVal,
    updateSubReturnTimeVal,
    deleteSubReturnTimeVal,
    
}