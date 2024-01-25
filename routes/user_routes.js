import express from 'express'
import { registerUser, UserLogin } from '../controllers/user_controller.js';
import { sendOTP, verifyOtp } from '../controllers/otp_controller.js';
const router = express.Router()

router.post('/signup', registerUser)
router.post('/send-otp', sendOTP);
router.post('/verifyotp', verifyOtp )
router.post('/login', UserLogin )

export default router

