import Joi from "joi";


export const startOrderVal = Joi.object({
    orderId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': 'يجب أن يكون المعرف بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون المعرف 24 حرفاً.',
            'any.required': 'المعرف مطلوب.',
        }),
});

export const onlineVal=Joi.object({
    online:Joi.boolean().required().messages({
        'boolean.base': 'يجب أن يكون هذا الحقل صحيحاً',
        'any.required': 'هذا الحقل مطلوب',
        
    })
})