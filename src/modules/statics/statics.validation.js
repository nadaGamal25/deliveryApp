import Joi from "joi";

const addQuestionVal = Joi.object({
    question: Joi.string().min(1).required().messages({
        "string.base": "يجب إدخال بيانات صحيح",
        "string.min": "يجب أن يكون البيانات حرفاً واحداً على الأقل",
    }),
    answer: Joi.string().min(1).required().messages({
        "string.base": "يجب إدخال بيانات صحيح",
        "string.min": "يجب أن يكون البيانات حرفاً واحداً على الأقل",
    }),
});

const updateQuestionVal = Joi.object({
    question: Joi.string().min(1).required().messages({
        "string.base": "يجب إدخال بيانات صحيح",
        "string.min": "يجب أن يكون البيانات حرفاً واحداً على الأقل",
    }),
    answer: Joi.string().min(1).required().messages({
        "string.base": "يجب إدخال بيانات صحيح",
        "string.min": "يجب أن يكون البيانات حرفاً واحداً على الأقل",
    }),
    id: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً"
    })
});

const deleteQuestionVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});

export{
    addQuestionVal,
    updateQuestionVal,
    deleteQuestionVal,
    
}