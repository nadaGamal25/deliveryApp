import Joi from "joi";

const addSubscriptionVal = Joi.object({
    duration: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    goTime: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    returnTime: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    startingPlace: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
        }),
    goPlace: Joi.string().required().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),

});

const updateSubscriptionVal = Joi.object({
    duration: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    goTime: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    returnTime: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    startingPlace: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
        }),
    goPlace: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    id: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً"
    })
});

const deleteSubscriptionVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});



export{
    addSubscriptionVal,
    updateSubscriptionVal,
    deleteSubscriptionVal,
    
}