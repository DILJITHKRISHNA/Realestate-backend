import express from 'express'
import { AddProperty, GetKycData, ImageUpload, OwnersendOtp, RegisterWithGoogle, getPropertyData, handleKycData, ownerLogin, ownerSignup, ownerVerifyOtp } from '../controllers/OwnerController.js'

const router = express.Router()


router.post('/owner/signup', ownerSignup)
router.post('/owner/send-otp', OwnersendOtp);
router.post('/owner/verify-otp',ownerVerifyOtp )
router.post('/owner/login', ownerLogin)
router.post('/owner/profile', handleKycData)
router.post('/owner/ownerRegisterWithGoogle', RegisterWithGoogle)
router.get('/kyc',GetKycData)
router.post(`/owner/property/:id`, AddProperty)
router.post('/owner/uploadimage', ImageUpload)
router.get('/owner/getproperty', getPropertyData)


export default router