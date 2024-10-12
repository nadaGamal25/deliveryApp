import Joi from 'joi'


const signupVal=Joi.object({
    name:Joi.string().min(3).max(100).required(),
    phone:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
    confirmPassword:Joi.string().valid(Joi.ref('password')),
    position:Joi.string().min(2).max(100).required(),
    village:Joi.string().min(2).max(100),
    address:Joi.string().min(3).max(200).required(),
    urlLocation:Joi.string().min(3).max(200),
    role:Joi.string().required(),
    numberOfOrders:Joi.number(),
    wallet:Joi.number(),
    numberOfConnect:Joi.number(),
    rateAvg:Joi.number().min(0).max(5),
    isConfirmed:Joi.boolean(),
    isBlocked:Joi.boolean(),
    startTime:Joi.string().min(5).max(5),
    endTime:Joi.string().min(5).max(5),
    vehiclesImgs: Joi.array().items().min(0),
    categoryId:Joi.string().hex().length(24),
    profileImg:Joi.string(),


})

const signinVal = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
    confirmPassword:Joi.string().valid(Joi.ref('password')),

})

const updateUserVal=Joi.object({
    name:Joi.string().min(3).max(100),
    phone:Joi.string(),
    email:Joi.string().email(),
    position:Joi.string().min(2).max(100),
    village:Joi.string().min(2).max(100),
    address:Joi.string().min(3).max(200),
    urlLocation:Joi.string().min(3).max(200),
    startTime:Joi.string().min(5).max(5),
    endTime:Joi.string().min(5).max(5),
    vehiclesImgs: Joi.array().items().min(0),
    categoryId:Joi.string().hex().length(24),
    profileImg:Joi.string(),

})

const changePasswordVal=Joi.object({
    oldPassword:Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
    newPassword:Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
    confirmPassword:Joi.string().valid(Joi.ref('newPassword')),

})

const forgetPassVal=Joi.object({
    email:Joi.string().email().required(),
})

const updatePassVal=Joi.object({
    otp:Joi.string().required(),
    newPassword :Joi.string().pattern(/^[A-Z][A-Za-z0-9#@$]{8,20}$/).required(),
    confirmPassword:Joi.string().valid(Joi.ref('newPassword')),
})

const regenerateOtpVal=Joi.object({
    email:Joi.string().email().required(),
})

const addConnectVal=Joi.object({
    id:Joi.string().hex().length(24).required,
})
export{
    signupVal,signinVal,updateUserVal,changePasswordVal,forgetPassVal,updatePassVal,regenerateOtpVal,addConnectVal
}