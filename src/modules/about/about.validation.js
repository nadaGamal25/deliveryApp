import Joi from "joi";

const addTextVal = Joi.object({
    text: Joi.string().min(1).required().messages({
        "string.base": "يجب إدخال تعليق صحيح",
        "string.min": "يجب أن يكون التعليق حرفاً واحداً على الأقل",
    }),
 
});

const updateTextVal = Joi.object({
    text: Joi.string().min(1).required().messages({
        "string.base": "يجب إدخال تعليق صحيح",
        "string.min": "يجب أن يكون التعليق حرفاً واحداً على الأقل",
    }),
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});

const deleteTextVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});



export{
    addTextVal,
    updateTextVal,
    deleteTextVal,
    
}