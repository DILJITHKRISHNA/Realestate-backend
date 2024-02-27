import express from 'express'
import {
    cancelPayment,
    CheckIsBooked,
    forgotPass,
    GetProperty,
    GooglAuthLogin,
    GooglAuthRegister,
    Payment,
    PaymentHistory,
    PaymentSuccess,
    registerUser,
    ResendOtp,
    resetPassword,
    SinglyFetchProperty,
    UserLogin
} from '../controllers/UserController.js';
import { sendOTP, verifyOtp } from '../controllers/OtpController.js';
import { UserAuth } from '../Middleware/UserAuth.js';
const router = express.Router()

router.post('/signup', registerUser)
router.post('/send-otp', sendOTP);
router.post('/verifyotp', verifyOtp)
router.post('/login', UserLogin)
router.post('/forgotPassword', forgotPass)
router.post('/resetpassword', resetPassword)
router.post('/userRegisterWithGoogle', GooglAuthRegister)
router.post('/userLoginWithGoogle', GooglAuthLogin)
router.get('/property', UserAuth, GetProperty)
router.get('/property/:id', UserAuth, SinglyFetchProperty)
router.post('/property/bookproperty/:id', UserAuth, CheckIsBooked)
router.post('/property/paymentreq/:id', UserAuth, Payment)
router.post('/property/success/:id', UserAuth, PaymentSuccess)
router.get('/paymenthistory', UserAuth, PaymentHistory)
router.post('/paymenthistory/:id', UserAuth, cancelPayment)
router.post('/resendotp', ResendOtp)


export default router

