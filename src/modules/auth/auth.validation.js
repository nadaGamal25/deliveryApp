import Joi from 'joi'

const signupVal = Joi.object({
    profileImg: Joi.string().allow("").messages({
        'object.base': 'يجب أن تكون الصورة صالحة'
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
    email: Joi.string().email().required().messages({
        'string.email': 'يجب إدخال بريد إلكتروني صالح',
        'string.empty': 'البريد الإلكتروني مطلوب',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required().messages({
        'string.pattern.base': 'يجب أن تكون كلمة المرور مكونة من 8-20 حرفًا، تبدأ بحرف كبير وتتضمن أرقامًا أو رموزًا',
        'string.empty': 'كلمة المرور مطلوبة',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
        'any.only': 'يجب أن تتطابق كلمة المرور مع تأكيد كلمة المرور'
    }),
    
    position: Joi.string().hex().length(24).required().messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
        'any.required': 'المنطقة مطلوبة'
    }),
    village: Joi.string().allow("").messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
    }),
    address: Joi.string().min(3).max(200).required().messages({
        'string.min': 'يجب أن يحتوي العنوان على 3 أحرف على الأقل',
        'string.max': 'يجب ألا يزيد العنوان عن 200 حرف',
        'any.required': 'العنوان مطلوب'
    }),
    urlLocation: Joi.string().min(3).max(200).messages({
        'string.min': 'يجب أن يحتوي رابط الموقع على 3 أحرف على الأقل',
        'string.max': 'يجب ألا يزيد رابط الموقع عن 200 حرف'
    }),
    role: Joi.string().required().messages({
        'string.empty': 'الدور مطلوب',
        'any.required': 'الدور مطلوب'
    }),
    numberOfOrders: Joi.number().messages({
        'number.base': 'عدد الطلبات يجب أن يكون رقمًا'
    }),
    wallet: Joi.number().messages({
        'number.base': 'المحفظة يجب أن تكون رقمًا'
    }),
    numberOfConnect: Joi.number().messages({
        'number.base': 'عدد الاتصالات يجب أن يكون رقمًا'
    }),
    rateAvg: Joi.number().min(0).max(5).messages({
        'number.base': 'التقييم يجب أن يكون رقمًا',
        'number.min': 'التقييم يجب ألا يقل عن 0',
        'number.max': 'التقييم يجب ألا يزيد عن 5'
    }),
    isConfirmed: Joi.boolean().messages({
        'boolean.base': 'يجب أن يكون التأكيد صحيح أو خطأ'
    }),
    isBlocked: Joi.boolean().messages({
        'boolean.base': 'يجب أن يكون الحظر صحيح أو خطأ'
    }),
    startTime: Joi.string().min(5).max(5).messages({
        'string.min': 'يجب أن يكون وقت البدء بتنسيق 5 أحرف (HH:mm)',
        'string.max': 'يجب أن يكون وقت البدء بتنسيق 5 أحرف (HH:mm)'
    }),
    endTime: Joi.string().min(5).max(5).messages({
        'string.min': 'يجب أن يكون وقت الانتهاء بتنسيق 5 أحرف (HH:mm)',
        'string.max': 'يجب أن يكون وقت الانتهاء بتنسيق 5 أحرف (HH:mm)'
    }),
    vehiclesImgs: Joi.array().items().min(0).messages({
        'array.base': 'يجب أن تكون الصور في شكل قائمة'
    }),
    categoryId: Joi.string().messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
        'any.required': 'الفئة مطلوبة'
    }),
   
    dateOfBirth:Joi.date().required().messages({
        'date.base': 'تاريخ الميلاد مطلوب',
        'any.required': 'تاريخ الميلاد مطلوب'
    }),
    positionLocation:Joi.string().messages({
        'string.base': 'الموقع  يجب أن يكون نصًا'

    }),
    description:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    }),
    vevehicleNumber:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    }),
    vehicleColor:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    }),
    vehicleType:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    })
});


const signinVal = Joi.object({
    phone: Joi.string().required().messages({
        'string.empty': 'رقم الهاتف مطلوب',
        'any.required': 'رقم الهاتف مطلوب'
    }),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required().messages({
        'string.pattern.base': 'يجب أن تكون كلمة المرور مكونة من 8-20 حرفًا، تبدأ بحرف كبير وتتضمن أرقامًا أو رموزًا',
        'string.empty': 'كلمة المرور مطلوبة',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
        'any.only': 'يجب أن تتطابق كلمة المرور مع تأكيد كلمة المرور'
    }),
    fcmToken:Joi.string().allow("").
    messages({
        'string.empty': 'يجب أن يكون الرمز مطلوب',
    })

});

// const signupVal=Joi.object({
//     name:Joi.string().min(3).max(100).required(),
//     phone:Joi.string().required(),
//     email:Joi.string().email().required(),
//     password:Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
//     confirmPassword:Joi.string().valid(Joi.ref('password')),
//     position:Joi.string().min(2).max(100).required(),
//     village:Joi.string().min(2).max(100),
//     address:Joi.string().min(3).max(200).required(),
//     urlLocation:Joi.string().min(3).max(200),
//     role:Joi.string().required(),
//     numberOfOrders:Joi.number(),
//     wallet:Joi.number(),
//     numberOfConnect:Joi.number(),
//     rateAvg:Joi.number().min(0).max(5),
//     isConfirmed:Joi.boolean(),
//     isBlocked:Joi.boolean(),
//     startTime:Joi.string().min(5).max(5),
//     endTime:Joi.string().min(5).max(5),
//     vehiclesImgs: Joi.array().items().min(0),
//     categoryId:Joi.string().hex().length(24),
//     profileImg:Joi.string(),


// })

// const signinVal = Joi.object({
//     phone: Joi.string().required(),
//     password: Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
//     confirmPassword:Joi.string().valid(Joi.ref('password')),

// })

const updateUserVal=Joi.object({
    name: Joi.string().min(3).max(100).messages({
        'string.base': 'يجب أن يكون الاسم نصًا',
        'string.empty': 'الاسم مطلوب',
        'string.min': 'يجب أن يحتوي الاسم على 3 أحرف على الأقل',
        'string.max': 'يجب ألا يزيد الاسم عن 100 حرف',
        'any.required': 'الاسم مطلوب'
    }),
    phone: Joi.string().messages({
        'string.empty': 'رقم الهاتف مطلوب',
        'any.required': 'رقم الهاتف مطلوب'
    }),
    email: Joi.string().email().messages({
        'string.email': 'يجب إدخال بريد إلكتروني صالح',
        'string.empty': 'البريد الإلكتروني مطلوب',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).messages({
        'string.pattern.base': 'يجب أن تكون كلمة المرور مكونة من 8-20 حرفًا، تبدأ بحرف كبير وتتضمن أرقامًا أو رموزًا',
        'string.empty': 'كلمة المرور مطلوبة',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
        'any.only': 'يجب أن تتطابق كلمة المرور مع تأكيد كلمة المرور'
    }),
    
    position: Joi.string().hex().length(24).messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
        'any.required': 'المنطقة مطلوبة'
    }),
    village: Joi.string().messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
    }),
    address: Joi.string().min(3).max(200).messages({
        'string.min': 'يجب أن يحتوي العنوان على 3 أحرف على الأقل',
        'string.max': 'يجب ألا يزيد العنوان عن 200 حرف',
        'any.required': 'العنوان مطلوب'
    }),
    urlLocation: Joi.string().min(3).max(200).messages({
        'string.min': 'يجب أن يحتوي رابط الموقع على 3 أحرف على الأقل',
        'string.max': 'يجب ألا يزيد رابط الموقع عن 200 حرف'
    }),
    role: Joi.string().messages({
        'string.empty': 'الدور مطلوب',
        'any.required': 'الدور مطلوب'
    }),
    numberOfOrders: Joi.number().messages({
        'number.base': 'عدد الطلبات يجب أن يكون رقمًا'
    }),
    wallet: Joi.number().messages({
        'number.base': 'المحفظة يجب أن تكون رقمًا'
    }),
    numberOfConnect: Joi.number().messages({
        'number.base': 'عدد الاتصالات يجب أن يكون رقمًا'
    }),
    rateAvg: Joi.number().min(0).max(5).messages({
        'number.base': 'التقييم يجب أن يكون رقمًا',
        'number.min': 'التقييم يجب ألا يقل عن 0',
        'number.max': 'التقييم يجب ألا يزيد عن 5'
    }),
    isConfirmed: Joi.boolean().messages({
        'boolean.base': 'يجب أن يكون التأكيد صحيح أو خطأ'
    }),
    isBlocked: Joi.boolean().messages({
        'boolean.base': 'يجب أن يكون الحظر صحيح أو خطأ'
    }),
    startTime: Joi.string().min(5).max(5).messages({
        'string.min': 'يجب أن يكون وقت البدء بتنسيق 5 أحرف (HH:mm)',
        'string.max': 'يجب أن يكون وقت البدء بتنسيق 5 أحرف (HH:mm)'
    }),
    endTime: Joi.string().min(5).max(5).messages({
        'string.min': 'يجب أن يكون وقت الانتهاء بتنسيق 5 أحرف (HH:mm)',
        'string.max': 'يجب أن يكون وقت الانتهاء بتنسيق 5 أحرف (HH:mm)'
    }),
    vehiclesImgs: Joi.array().items().min(0).allow("").messages({
        'array.base': 'يجب أن تكون الصور في شكل قائمة'
    }),
    categoryId: Joi.string().hex().length(24).messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
        'any.required': 'الفئة مطلوبة'
    }),
    profileImg: Joi.allow("").messages({
        'object.base': 'يجب أن تكون الصورة صالحة'
    }),
   
    dateOfBirth:Joi.date().messages({
        'date.base': 'تاريخ الميلاد مطلوب',
        'any.required': 'تاريخ الميلاد مطلوب'
    }),
    positionLocation:Joi.string().messages({
        'string.base': 'الموقع  يجب أن يكون نصًا'

    }),
    description:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    }),
    vehicleNumber:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    }),
    vehicleColor:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    }),
    vehicleType:Joi.string().messages({
        'string.base': '  يجب أن يكون نصًا'

    }),
    id:Joi.string().hex().length(24).messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
        'any.required': ' مطلوبة'
    }),

})

const changePasswordVal=Joi.object({
    oldPassword:Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required().messages({
        'string.pattern.base': 'يجب أن تكون كلمة المرور مكونة من 8-20 حرفًا، تبدأ بحرف كبير وتتضمن أرقامًا أو رموزًا',
        'string.empty': 'كلمة المرور مطلوبة',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    newPassword:Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required().messages({
        'string.pattern.base': 'يجب أن تكون كلمة المرور مكونة من 8-20 حرفًا، تبدأ بحرف كبير وتتضمن أرقامًا أو رموزًا',
        'string.empty': 'كلمة المرور مطلوبة',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    confirmPassword:Joi.string().valid(Joi.ref('newPassword')).messages({
        'any.only': 'يجب أن تتطابق كلمة المرور مع تأكيد كلمة المرور'
    }),

})

const forgetPassVal=Joi.object({
    email:Joi.string().email().required().messages({
        'string.email': 'يجب إدخال بريد إلكتروني صالح',
        'string.empty': 'البريد الإلكتروني مطلوب',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
})
const confirmOtpVal=Joi.object({
    otp:Joi.string().min(6).max(6).required().messages({
        'string.empty': 'رمز التحقق مطلوب',
        'any.required': 'رمز التحقق مطلوب',
        'string.min': 'يجب أن يكون رمز التحقق 6 أحرفًا',
        'string.max': 'يجب أن يكون رمز التحقق 6 أحرفًا',
}) 
})
const updatePassVal=Joi.object({
    userId:Joi.string().hex().length(24).required().messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
        'any.required': ' مطلوبة'
    }),
    newPassword :Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required().messages({
        'string.pattern.base': 'يجب أن تكون كلمة المرور مكونة من 8-20 حرفًا، تبدأ بحرف كبير وتتضمن أرقامًا أو رموزًا',
        'string.empty': 'كلمة المرور مطلوبة',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    confirmPassword:Joi.string().valid(Joi.ref('newPassword')).messages({
        'any.only': 'يجب أن تتطابق كلمة المرور مع تأكيد كلمة المرور'
    }),
})

const regenerateOtpVal=Joi.object({
    email:Joi.string().email().required().messages({
        'string.email': 'يجب إدخال بريد إلكتروني صالح',
        'string.empty': 'البريد الإلكتروني مطلوب',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
})

const addConnectVal=Joi.object({
    id:Joi.string().hex().length(24).required().messages({
        'string.hex': 'يجب أن يكون معرّف الفئة بتنسيق صحيح',
        'string.length': 'يجب أن يكون معرّف الفئة 24 حرفًا',
        'any.required': ' مطلوبة'
    }),
})
export{
    signupVal,signinVal,updateUserVal,changePasswordVal,forgetPassVal,updatePassVal,
    regenerateOtpVal,addConnectVal,confirmOtpVal
}