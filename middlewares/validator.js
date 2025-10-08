const Joi = require('joi');

const signupSchema = Joi.object({
    email: Joi.string().required().min(6).max(60).email({ tlds: {allow: ['com', 'net']} }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,100}$')).required()
    // confirmPassword: Joi.ref('password')
})

const signinSchema = Joi.object({
    email: Joi.string().required().min(6).max(60).email({ tlds: {allow: ['com', 'net']} }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,100}$')).required()
})

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,100}$')).required(),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,100}$')).required()
})

const acceptCodeSchema = Joi.object({
    email: Joi.string().required().min(6).max(60).email({ tlds: {allow: ['com', 'net']} }),
    providedCode: Joi.number().length(6).required()
})

module.exports = { signupSchema, signinSchema, changePasswordSchema, acceptCodeSchema }