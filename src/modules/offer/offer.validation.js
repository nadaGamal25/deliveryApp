import Joi from 'joi'

const addOfferVal = Joi.object({
    time: Joi.string()
        .required()
        .messages({
            'string.base': 'يجب أن يكون الوقت نصاً صحيحاً.',
            'any.required': 'الوقت مطلوب.',
        }),
    price: Joi.number()
        .min(1)
        .required()
        .messages({
            'number.base': 'يجب أن يكون السعر رقماً صحيحاً.',
            'number.min': 'يجب أن يكون السعر أكبر من أو يساوي 1.',
            'any.required': 'السعر مطلوب.',
        }),
    status: Joi.string()
        .messages({
            'string.base': 'يجب أن تكون الحالة نصاً صحيحاً.',
        }),
    orderId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون معرف الطلب بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون معرف الطلب 24 حرفاً.',
            'any.required': 'معرف الطلب مطلوب.',
        }),
    driverId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون معرف السائق بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون معرف السائق 24 حرفاً.',
            'any.required': 'معرف السائق مطلوب.',
        }),
});

const deleteOfferVal = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون المعرف بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون المعرف 24 حرفاً.',
            'any.required': 'المعرف مطلوب.',
        }),
});

const getOffersByOrderIdVal = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون معرف الطلب بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون معرف الطلب 24 حرفاً.',
            'any.required': 'معرف الطلب مطلوب.',
        }),
});

const getOffersByUserIdVal = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون معرف المستخدم بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون معرف المستخدم 24 حرفاً.',
            'any.required': 'معرف المستخدم مطلوب.',
        }),
    status:Joi.string()    
});

const changeOfferStatusVal = Joi.object({
    status: Joi.string()
        .required()
        .messages({
            'string.base': 'يجب أن تكون الحالة نصاً صحيحاً.',
            'any.required': 'الحالة مطلوبة.',
        }),
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون المعرف بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون المعرف 24 حرفاً.',
            'any.required': 'المعرف مطلوب.',
        }),
});

export{
    addOfferVal,deleteOfferVal,getOffersByOrderIdVal,getOffersByUserIdVal,changeOfferStatusVal
}