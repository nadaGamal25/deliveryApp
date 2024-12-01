import Joi from "joi";

const addSocialVal = Joi.object({
    phone: Joi.string().messages({
        'string.empty': 'رقم الهاتف مطلوب',
        'any.required': 'رقم الهاتف مطلوب'
    }),
    email: Joi.string().email().messages({
        'string.email': 'يجب إدخال بريد إلكتروني صالح',
        'string.empty': 'البريد الإلكتروني مطلوب',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    pages:Joi.object().min(0).messages({
        'string.empty': 'الصفحات مطلوبة',
        'any.required': 'الصفحات مطلوبة'
    })
});

const updateSocialVal = Joi.object({
    phone: Joi.string().messages({
        'string.empty': 'رقم الهاتف مطلوب',
        'any.required': 'رقم الهاتف مطلوب'
    }),
    email: Joi.string().email().messages({
        'string.email': 'يجب إدخال بريد إلكتروني صالح',
        'string.empty': 'البريد الإلكتروني مطلوب',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    pages:Joi.object().min(0).messages({
        'string.empty': 'الصفحات مطلوبة',
        'any.required': 'الصفحات مطلوبة'
    }),
    id: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً"
    })
});

const deleteSocialVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});



export{
    addSocialVal,
    updateSocialVal,
    deleteSocialVal,
    
}