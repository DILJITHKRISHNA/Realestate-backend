import express from 'express'
import { OwnersendOtp, ownerLogin, ownerSignup, ownerVerifyOtp } from '../controllers/owner_controller.js'

const router = express.Router()


router.post('/owner/signup', ownerSignup)
router.post('/owner/send-otp', OwnersendOtp);
router.post('/owner/verify-otp',ownerVerifyOtp )
router.post('/owner/login', ownerLogin)


export default router