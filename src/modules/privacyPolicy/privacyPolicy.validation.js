import Joi from "joi";

const addPrivacyVal = Joi.object({
    content: Joi.string().messages({
        'string.empty': ' مطلوب',
        'any.required': ' مطلوب'
    }),
    effectiveDate: Joi.date().messages({
        'date.base': 'يجب أن يكون التاريخ صالحاً.',
        'any.required': 'التاريخ مطلوب.',
    }),
});


const deletePrivacyVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});



export{
    addPrivacyVal,
    deletePrivacyVal,
    
}