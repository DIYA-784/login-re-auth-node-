const express = require('express');

const Router = express.Router();
const authController = require('../controllers/authController');
const { identifier } = require('../middlewares/identification');

Router.post('/signup', authController.signup);

Router.post('/signin', authController.signin);

Router.post('/signout', identifier, authController.signout);

Router.patch('/send-verification-code', identifier, authController.sendVerificationCode);

Router.patch('/verify-verification-code', identifier, authController.verifyVerificationCode);

Router.patch('/change-password', identifier, authController.changePassword);

module.exports = Router;