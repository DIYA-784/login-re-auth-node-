const { signupSchema, signinSchema, changePasswordSchema, acceptCodeSchema } = require('../middlewares/validator');
const { doHashing, hmacProcess, comparePassword } = require('../utils/hashing');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const transporter = require('../middlewares/sendMail');

signup = async (req, res) => {
    const {email, password} = req.body;
    try{
        const {error, value} = signupSchema.validate({email, password});
        if(error){
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(401).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await doHashing(password);

        const newUser = new User({
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        savedUser.password = undefined; // so that password is not sent in response

        return res.status(201).json({ success: true, message: 'User registered successfully', user: savedUser });
    } catch(err){
        console.log(err);
    }
}

signin = async (req, res) => {
    const {email, password} = req.body;
    try{
        const { error, value } = signinSchema.validate({ email, password});
        if(error){
            return res.status(401).json({ success: false, message: error.details[0].message});
        }

        const existingUser = await User.findOne({ email }).select('+password');
        if(!existingUser){
            return res.status(401).json({ success: false, message: 'User does not Exist !' });
        }

        const isPasswordValid = await comparePassword(password, existingUser.password);
        if(!isPasswordValid){
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                verification: existingUser.verified
            },
            process.env.SECRET_KEY,
            { expiresIn: '8h' }
        );
        res.cookie('Authorization', 'Bearer ' + token, 
            { httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production' });

        return res.status(200).json({ success: true, token, message: 'User signed in successfully' });
    } catch(err){
        console.log(err);
    }
};

signout = async(req, res)=> {
    res.clearCookie('Authorization').status(200).json({ success: true, message: 'User signed out successfully' });
}

sendVerificationCode = async(req, res) => {
    const { email } = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(404).json({ success: false, message: 'User does not Exist !' });
        }
        if(existingUser.verified){
            return res.status(401).json({ success: false, message: 'User already verified !' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();   
        let info = await transporter.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: "Verification Code",
            html: "<h1>" + code + "</h1>"
        });
        // return res.status(200).json({ success: true, message: 'Verification code sent to email', info, code });
        if(info.accepted[0] === existingUser.email){
            const hashedCodeValue = hmacProcess(code, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Verification code sent to email' });
        }
        return res.status(400).json({ success: true, message: 'Verification code sent failed !' });
    } catch(err){
        console.log(err);
    }
}

verifyVerificationCode = async(req, res) => {
    const { email, providedCode } = req.body;
    try{
        const { error, value } = acceptCodeSchema.validate({ email, providedCode });
        if(error){
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email }).select('+verificationCode +verificationCodeValidation');
        if(!existingUser){
            return res.status(404).json({ success: false, message: 'User does not Exist !' });
        }
        if(existingUser.verified){
            return res.status(401).json({ success: false, message: 'User already verified !' });
        }
        if(!existingUser.verificationCode || !existingUser.verificationCodeValidation){
            return res.status(401).json({ success: false, message: 'Please request a new verification code !' });
        }
        if(Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000){
            return res.status(401).json({ success: false, message: 'Verification code expired ! Please request a new one' });
        }

        const hashedProvidedCode = hmacProcess(providedCode, process.env.HMAC_VERIFICATION_CODE_SECRET);
        if(hashedProvidedCode === existingUser.verificationCode){
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'User verified successfully' });
        }
        return res.status(401).json({ success: false, message: 'Invalid verification code !' });
    } catch(err){
        console.log(err);
    }
}

changePassword = async(req, res) => {
    const { userId, verification } = req.user;
    const { oldPassword, newPassword } = req.body;

    try{
        const { error, value } = changePasswordSchema.validate({ oldPassword, newPassword });
        if(error){
            return res.status(401).json({ success: false, message: error.details[0].message });
        }
        if(!verification){
            return res.status(401).json({ success: false, message: 'Unverified User ! Access denied' });
        }

        const existingUser = await User.findOne({ _id: userId }).select('+password');
        if(!existingUser){
            return res.status(401).json({ success: false, message: 'User does not Exist !' });
        }

        const result = await comparePassword(oldPassword, existingUser.password);
        if(!result){
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const hashedPassword = await doHashing(newPassword);
        existingUser.password = hashedPassword;
        await existingUser.save();
        existingUser.password = undefined;

        return res.status(200).json({ success: true, message: 'Password changed successfully', user: existingUser });
    } catch(err){
        console.log(err);
    }
}

module.exports = { signup, signin, signout, changePassword, sendVerificationCode, verifyVerificationCode };