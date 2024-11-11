import Joi from "joi";

const addReviewVal = Joi.object({
    comment: Joi.string().min(1).max(500).required().messages({
        "string.base": "يجب إدخال تعليق صحيح",
        "string.min": "يجب أن يكون التعليق حرفاً واحداً على الأقل",
        "string.max": "يجب ألا يزيد التعليق عن 500 حرف"
    }),
    rate: Joi.number().min(1).max(5).required().messages({
        "number.base": "يجب إدخال تقييم صحيح",
        "number.min": "يجب أن يكون التقييم من 1 إلى 5",
        "number.max": "يجب أن يكون التقييم من 1 إلى 5"
    }),
    driver: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف السائق صالحاً",
        "string.hex": "يجب أن يكون معرف السائق بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف السائق بطول 24 حرفاً"
    }),
    client: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف العميل صالحاً",
        "string.hex": "يجب أن يكون معرف العميل بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف العميل بطول 24 حرفاً"
    })
});

const updateReviewVal = Joi.object({
    comment: Joi.string().min(1).max(500).messages({
        "string.base": "يجب إدخال تعليق صحيح",
        "string.min": "يجب أن يكون التعليق حرفاً واحداً على الأقل",
        "string.max": "يجب ألا يزيد التعليق عن 500 حرف"
    }),
    rate: Joi.number().min(1).max(5).messages({
        "number.base": "يجب إدخال تقييم صحيح",
        "number.min": "يجب أن يكون التقييم من 1 إلى 5",
        "number.max": "يجب أن يكون التقييم من 1 إلى 5"
    }),
    driver: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف السائق صالحاً",
        "string.hex": "يجب أن يكون معرف السائق بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف السائق بطول 24 حرفاً"
    }),
    client: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف العميل صالحاً",
        "string.hex": "يجب أن يكون معرف العميل بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف العميل بطول 24 حرفاً"
    }),
    id: Joi.string().hex().length(24).messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً"
    })
});

const deleteReviewVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});

const getReviewVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});


export{
    addReviewVal,
    updateReviewVal,
    deleteReviewVal,
    getReviewVal
}