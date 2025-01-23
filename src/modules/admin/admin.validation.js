import Joi from 'joi';


const confirmUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()
})

const blockUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()

})

const invalidUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()

})
const highlightUserVal=Joi.object({
    id:Joi.string().hex().length(24).required(),
    value:Joi.boolean().required()

})
const updateOrderVal = Joi.object({
    id:Joi.string().hex().length(24).required(),
    clientAddress: Joi.string()
        .min(0)
        .messages({
            'string.base': 'يجب أن يكون العنوان صحيحاً.',
            'string.min': 'يجب أن يكون العنوان 1 أحرف على الأقل.',
        }),
    recieverAddress: Joi.string()
        .min(0)
        
        .messages({
            'string.base': 'يجب أن يكون عنوان المستلم صحيحاً.',
            'string.min': 'يجب أن يكون عنوان المستلم حرفاً واحداً على الأقل.',
        }),
    clientName: Joi.string()
        
        .messages({
            'string.base': 'يجب أن يكون اسم العميل صحيحاً.',
        }),
    recieverName: Joi.string()
        .messages({
            'string.base': 'يجب أن يكون اسم المستلم صحيحاً.',
        }),
    clientPhone: Joi.string()
        
        .messages({
            'string.base': 'يجب أن يكون رقم العميل صحيحاً.',
        }),
    recieverPhone: Joi.string()
        .messages({
            'string.base': 'يجب أن يكون رقم المستلم صحيحاً.',
        }),
    goDate: Joi.date()
        
        .messages({
            'date.base': 'يجب أن يكون التاريخ صالحاً.',
        }),
    nums: Joi.number()
        
        .messages({
            'number.base': 'يجب أن يكون العدد رقماً صحيحاً.',
        }),
    price: Joi.number()
        
        .messages({
            'number.base': 'يجب أن يكون السعر رقماً صحيحاً.',
        }),
    type: Joi.string()
        
        .messages({
            'string.base': 'يجب أن يكون النوع صحيحاً.',
        }),
    goTime: Joi.string()
        .min(1)
        
        .messages({
            'string.base': 'يجب أن يكون وقت الانطلاق صحيحاً.',
            'string.min': 'يجب أن يكون وقت الانطلاق حرفاً واحداً على الأقل.',
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
        
        .messages({
            'boolean.base': 'يجب أن تكون النصيحة قيمة صحيحة.',
        }),
    clientId: Joi.string()
        .hex()
        .length(24)
        
        .messages({
            'string.hex': 'يجب أن يكون معرف العميل بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون معرف العميل 24 حرفاً.',
        }),
   
    clientPosition: Joi.string()
      
        
        .messages({
            'string.hex': 'يجب أن يكون موقع العميل بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون موقع العميل 24 حرفاً.',
        }),
    recieverPosition: Joi.string()
       
        
        .messages({
            'string.hex': 'يجب أن يكون موقع المستلم بتنسيق صحيح (سداسي عشري).',
            'string.length': 'يجب أن يكون موقع المستلم 24 حرفاً.',
        }),
    orderImgs: Joi.array()
        .items()
        .min(0)
        .messages({
            'array.base': 'يجب أن يكون الصور مصفوفة.',
        }),
    deliveryType:Joi.string().messages({
        'string.base': 'يجب أن يكون نوع التوصيل قيمة صحيحة.',

    })  ,
    payType:Joi.string().messages({
        'string.base': 'يجب أن يكون نوع التوصيل قيمة صحيحة.',

    }),
    shopping: Joi.array().items(
        Joi.object({
            store: Joi.string()
                .messages({
                    'string.base': 'يجب أن يكون اسم المتجر نصاً صحيحاً.',
                }),
            products: Joi.array().items(
                    Joi.object({
                        name: Joi.string()
                            .messages({
                                'string.base': 'يجب أن يكون اسم المنتج نصاً صحيحاً.',
                            }),
                        quantity: Joi.number()
                            .messages({
                                'number.base': 'يجب أن تكون الكمية رقماً صحيحاً.',
                            }),
                    })
                )
                .messages({
                    'array.base': 'يجب أن تكون المنتجات مصفوفة.',
                }),
        })
    )
    .messages({
        'array.base': 'يجب أن يكون التسوق مصفوفة.',
    }),

});
export{
    confirmUserVal,blockUserVal,invalidUserVal,highlightUserVal,updateOrderVal
}