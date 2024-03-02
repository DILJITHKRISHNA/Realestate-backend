import express from 'express'
import {
    AddProperty,
    EditProperty,
    FetchCategory,
    FetchProperty,
    GetBookingData,
    GetKycData,
    GetPaginateProperty,
    ImageUpload,
    OwnersendOtp,
    RegisterWithGoogle,
    getOwnerData,
    getPropertyData,
    handleKycData,
    hideProperty,
    ownerLogin,
    ownerSignup,
    ownerVerifyOtp
} from '../controllers/OwnerController.js'
import { OwnerAuth } from '../Middleware/OwnerAuth.js'

const router = express.Router()


router.post('/owner/signup', ownerSignup)
router.post('/owner/send-otp', OwnersendOtp);
router.post('/owner/verify-otp', ownerVerifyOtp)
router.post('/owner/login', ownerLogin)
router.post('/owner/profile', OwnerAuth, handleKycData)
router.post('/owner/ownerRegisterWithGoogle', RegisterWithGoogle)
router.get('/kyc', OwnerAuth, GetKycData)
router.post(`/owner/property/:id`, OwnerAuth, AddProperty)
router.post('/owner/uploadimage', OwnerAuth, ImageUpload)
router.get('/owner/getproperty', OwnerAuth, getPropertyData)
router.post('/owner/editproperty/:id', OwnerAuth, EditProperty)
router.post('/owner/hideproperty/:id', OwnerAuth, hideProperty)
router.get('/owner/FetchBookings', OwnerAuth, GetBookingData)
router.get('/owner/getproperty/:id', OwnerAuth, FetchProperty)
router.get('/owner/fetchcategory', OwnerAuth, FetchCategory)
router.get('/properties/:page', GetPaginateProperty);
router.get('/owner/profile/:id', getOwnerData);



export default router