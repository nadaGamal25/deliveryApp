import Joi from "joi";


export const startOrderVal = Joi.object({
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