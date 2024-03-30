import express from 'express'
import {
    AddProperty,
    Addprofileimage,
    EditOwnerProfileData,
    EditProperty,
    FetchCategory,
    FetchProperty,
    FetchPropertyForChart,
    GetBookingData,
    GetKycData,
    GetPaginateProperty,
    ImageUpload,
    LoginWithGoogle,
    OwnersendOtp,
    RegisterWithGoogle,
    ResetOwnerPassword,
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
router.get('/owner/ownerLoginWithGoogle/:ownerGoogleEmail', LoginWithGoogle)
router.get('/kyc', OwnerAuth, GetKycData)
router.post(`/owner/property/:id`, OwnerAuth, AddProperty)
router.put('/owner/uploadimage', OwnerAuth, ImageUpload)
router.get('/owner/getproperty', OwnerAuth, getPropertyData)
router.put('/owner/editproperty/:id', OwnerAuth, EditProperty)
router.patch('/owner/hideproperty/:id', OwnerAuth, hideProperty)
router.get('/owner/FetchBookings', OwnerAuth, GetBookingData)
router.get('/owner/getproperty/:id', OwnerAuth, FetchProperty)
router.get('/owner/fetchcategory', OwnerAuth, FetchCategory)
router.get('/properties/:page/:id', GetPaginateProperty);
router.get('/owner/profile/:id', getOwnerData);
router.patch('/profileimage/:id', Addprofileimage);
router.patch('/resetownersecurity/:id',OwnerAuth, ResetOwnerPassword);
router.put('/editprofile/:id', EditOwnerProfileData);
router.get('/owner/getownerproperty/:id', OwnerAuth, FetchPropertyForChart)





export default router