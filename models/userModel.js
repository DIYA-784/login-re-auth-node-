const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    /* name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
        maxLength: [30, 'Name must be at most 30 characters long']
    }, */
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        minLength: [5, 'Email must be at least 5 characters long'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long'],
        select: false,  // when we fetch the user data we dont want to fetch the password unless we explicitly ask for it
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeValidation: {
        type: Number,
        select: false
    },
    forgotPasswordCode: {
        type: String,
        select: false
    },
    forgotPasswordCodeValidation: {
        type: Number,
        select: false
    }
},
{ 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);