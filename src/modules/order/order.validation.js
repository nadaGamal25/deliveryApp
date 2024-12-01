import Joi from 'joi'
const addOrderVal = Joi.object({
    clientAddress: Joi.string()
        .min(5)
        .required()
        .messages({
            'string.base': 'يجب أن يكون العنوان صحيحاً.',
            'string.min': 'يجب أن يكون العنوان 5 أحرف على الأقل.',
            'any.required': 'العنوان مطلوب.',
        }),
    recieverAddress: Joi.string()
        .min(1)
        .required()
        .messages({
            'string.base': 'يجب أن يكون عنوان المستلم صحيحاً.',
            'string.min': 'يجب أن يكون عنوان المستلم حرفاً واحداً على الأقل.',
            'any.required': 'عنوان المستلم مطلوب.',
        }),
    clientName: Joi.string()
        .required()
        .messages({
            'string.base': 'يجب أن يكون اسم العميل صحيحاً.',
            'any.required': 'اسم العميل مطلوب.',
        }),
    recieverName: Joi.string()
        .messages({
            'string.base': 'يجب أن يكون اسم المستلم صحيحاً.',
        }),
    clientPhone: Joi.string()
        .required()
        .messages({
            'string.base': 'يجب أن يكون رقم العميل صحيحاً.',
            'any.required': 'رقم العميل مطلوب.',
        }),
    recieverPhone: Joi.string()
        .messages({
            'string.base': 'يجب أن يكون رقم المستلم صحيحاً.',
        }),
    goDate: Joi.date()
        .required()
        .messages({
            'date.base': 'يجب أن يكون التاريخ صالحاً.',
            'any.required': 'التاريخ مطلوب.',
        }),
    nums: Joi.number()
        .required()
        .messages({
            'number.base': 'يجب أن يكون العدد رقماً صحيحاً.',
            'any.required': 'العدد مطلوب.',
        }),
    price: Joi.number()
        .required()
        .messages({
            'number.base': 'يجب أن يكون السعر رقماً صحيحاً.',
            'any.required': 'السعر مطلوب.',
        }),
    type: Joi.string()
        .required()
        .messages({
            'string.base': 'يجب أن يكون النوع صحيحاً.',
            'any.required': 'النوع مطلوب.',
        }),
    goTime: Joi.string()
        .min(1)
        .required()
        .messages({
            'string.base': 'يجب أن يكون وقت الانطلاق صحيحاً.',
            'string.min': 'يجب أن يكون وقت الانطلاق حرفاً واحداً على الأقل.',
            'any.required': 'وقت الانطلاق مطلوب.',
        }),
    waitingTime: Joi.string()
        .messages({
            'string.base': 'يجب أن يكون وقت الانتظار صحيحاً.',
        }),
    notes: Joi.string()
        .messages({
            'string.base': 'يجب أن تكون الملاحظات نصاً صحيحاً.',
        }),
    isTips: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'يجب أن تكون النصيحة قيمة صحيحة.',
            'any.required': 'حقل النصيحة مطلوب.',
        }),
    clientId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون معرف العميل بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون معرف العميل 24 حرفاً.',
            'any.required': 'معرف العميل مطلوب.',
        }),
   
    clientPosition: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون موقع العميل بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون موقع العميل 24 حرفاً.',
            'any.required': 'موقع العميل مطلوب.',
        }),
    recieverPosition: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون موقع المستلم بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون موقع المستلم 24 حرفاً.',
            'any.required': 'موقع المستلم مطلوب.',
        }),
    orderImgs: Joi.array()
        .items()
        .min(0)
        .messages({
            'array.base': 'يجب أن يكون الصور مصفوفة.',
        }),
});

const cancelOrderVal = Joi.object({
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

const getOrderByIdVal = Joi.object({
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

const getOrderByStatusVal = Joi.object({
    status: Joi.string()
        .required()
        .messages({
            'string.base': 'يجب أن تكون الحالة نصاً صحيحاً.',
            'any.required': 'الحالة مطلوبة.',
        }),
});

const rateOrderVal = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون المعرف بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون المعرف 24 حرفاً.',
            'any.required': 'المعرف مطلوب.',
        }),
    orderRate: Joi.number()
        .min(0)
        .max(5)
        .required()
        .messages({
            'number.base': 'يجب أن تكون التقييم رقماً صحيحاً.',
            'number.min': 'يجب أن يكون التقييم 0 على الأقل.',
            'number.max': 'يجب أن يكون التقييم 5 على الأكثر.',
            'any.required': 'التقييم مطلوب.',
        }),
});

const recieveOrderVal = Joi.object({
    id: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون المعرف بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون المعرف 24 حرفاً.',
            'any.required': 'المعرف مطلوب.',
        }),
    qrcode:Joi.string()
    .required()
    .messages({
        'string.base': 'يجب أن يكون الباركود نصاً صحيحا',
        'any.required': 'الباركود مطلوب.',
        }),
});


export{
    addOrderVal,cancelOrderVal,getOrderByIdVal,getOrderByStatusVal,
    rateOrderVal,recieveOrderVal
}