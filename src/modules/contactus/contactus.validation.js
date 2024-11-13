import Joi from "joi";

const addMsgContactVal = Joi.object({
    comment: Joi.string().min(1).max(500).required().messages({
        "string.base": "يجب إدخال تعليق صحيح",
        "string.min": "يجب أن يكون التعليق حرفاً واحداً على الأقل",
        "string.max": "يجب ألا يزيد التعليق عن 500 حرف"
    }),
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': 'يجب أن يكون الاسم نصًا',
        'string.empty': 'الاسم مطلوب',
        'string.min': 'يجب أن يحتوي الاسم على 3 أحرف على الأقل',
        'string.max': 'يجب ألا يزيد الاسم عن 100 حرف',
        'any.required': 'الاسم مطلوب'
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'رقم الهاتف مطلوب',
        'any.required': 'رقم الهاتف مطلوب'
    }),
});


export{
    addMsgContactVal
    
}