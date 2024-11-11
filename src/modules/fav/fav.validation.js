import Joi from "joi";

const addFavVal = Joi.object({
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


const deleteFavVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});

const getFavVal = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        "string.base": "يجب أن يكون معرف المراجعة صالحاً",
        "string.hex": "يجب أن يكون معرف المراجعة بتنسيق سداسي عشري",
        "string.length": "يجب أن يكون معرف المراجعة بطول 24 حرفاً",
        "any.required": "معرف المراجعة مطلوب"
    })
});


export{
    addFavVal,
    deleteFavVal,
    getFavVal
}