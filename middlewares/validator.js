const Joi = require('joi');

const signupSchema = Joi.object({
    email: Joi.string().required().min(6).max(60).email({ tlds: {allow: ['com', 'net']} }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8}$')).required()
    // confirmPassword: Joi.ref('password')
})

module.exports = { signupSchema }