import express from 'express'
import {
    AddProfileImage,
    AddToWishlist,
    cancelPayment,
    CheckIsBooked,
    EditProfileData,
    forgotPass,
    GetPaginateProperty,
    GetProfileData,
    GetProperty,
    getWishlistData,
    GooglAuthLogin,
    GooglAuthRegister,
    Payment,
    PaymentHistory,
    PaymentSuccess,
    registerUser,
    ResendOtp,
    resetPassword,
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
router.post('/property/bookproperty/:id', UserAuth, CheckIsBooked)
router.post('/property/paymentreq/:id', UserAuth, Payment)
router.post('/property/success/:id', UserAuth, PaymentSuccess)
router.get('/paymenthistory', UserAuth, PaymentHistory)
router.post('/paymenthistory/:id', UserAuth, cancelPayment)
router.post('/resendotp', ResendOtp)
router.get('/getprofiledata/:id', GetProfileData)
router.get('/properties/:page', GetPaginateProperty);
router.post('/wishlist', AddToWishlist);
router.get('/wishlist/:id', getWishlistData);
router.post('/profileimage/:id', AddProfileImage);
router.post('/editprofile/:id', EditProfileData);


export default router

