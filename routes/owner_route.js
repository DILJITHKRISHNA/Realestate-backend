import express from 'express'
import { AddProperty, GetKycData, OwnersendOtp, RegisterWithGoogle, handleKycData, ownerLogin, ownerSignup, ownerVerifyOtp } from '../controllers/OwnerController.js'

const router = express.Router()


router.post('/owner/signup', ownerSignup)
router.post('/owner/send-otp', OwnersendOtp);
router.post('/owner/verify-otp',ownerVerifyOtp )
router.post('/owner/login', ownerLogin)
router.post('/owner/profile', handleKycData)
router.post('/owner/ownerRegisterWithGoogle', RegisterWithGoogle)
router.get('/kyc',GetKycData)
router.post(`/owner/property/:id`, AddProperty)


export default router