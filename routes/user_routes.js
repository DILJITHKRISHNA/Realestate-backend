import express from 'express'
import { registerUser } from '../controllers/user_controller.js';
import { sendOTP } from '../controllers/otp_controller.js';
const router = express.Router()

router.post('/signup', registerUser)
router.post('/send-otp', sendOTP);

export default router

