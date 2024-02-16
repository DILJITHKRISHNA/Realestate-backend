import express from 'express'
import {
    CheckIsBooked,
    forgotPass,
    GetProperty,
    GooglAuthLogin,
    GooglAuthRegister,
    PaymentData,
    registerUser,
    resetPassword,
    SinglyFetchProperty,
    UserLogin
} from '../controllers/UserController.js';
import { sendOTP, verifyOtp } from '../controllers/OtpController.js';
const router = express.Router()

router.post('/signup', registerUser)
router.post('/send-otp', sendOTP);
router.post('/verifyotp', verifyOtp)
router.post('/login', UserLogin)
router.post('/forgotPassword', forgotPass)
router.post('/resetpassword', resetPassword)
router.post('/userRegisterWithGoogle', GooglAuthRegister)
router.post('/userLoginWithGoogle', GooglAuthLogin)
router.get('/property', GetProperty)
router.get('/property/:id', SinglyFetchProperty)
router.post('/property/bookproperty/:id', CheckIsBooked)
router.post('/property/payment/:id', PaymentData)


export default router

