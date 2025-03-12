import Joi from "joi";

const addSubscriptionVal = Joi.object({
    duration: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    type: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    numOfChildren: Joi.number().messages({
        'number.empty': ' مطلوب',
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
    clientId: Joi.string()
            .hex()
            .length(24)
            
            .messages({
                'string.hex': 'يجب أن يكون معرف العميل بتنسيق صحيح (سداسي عشري).',
                'string.length': 'يجب أن يكون معرف العميل 24 حرفاً.',
                'any.required': 'معرف العميل مطلوب.',
    }),
    position: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المنطقة صالحاً",
        "string.hex": "يجب أن يكون معرف المنطقة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المنطقة بطول 24 حرفاً",
        "any.required": "معرف المنطقة مطلوب"
    })
});

const updateSubscriptionVal = Joi.object({
    duration: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    type: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    numOfChildren: Joi.number().messages({
        'number.empty': ' مطلوب',
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
    }),
    position: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المنطقة صالحاً",
        "string.hex": "يجب أن يكون معرف المنطقة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المنطقة بطول 24 حرفاً",
        "any.required": "معرف المنطقة مطلوب"
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