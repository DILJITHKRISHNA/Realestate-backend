import express from 'express'
import {
    AddProfileImage,
    AddToWishlist,
    cancelPayment,
    CheckIsBooked,
    EditProfileData,
    FetchCategory,
    FetchReservations,
    forgotPass,
    GetPaginateProperty,
    GetProfileData,
    GetProperty,
    getPropertyData,
    GetPropertyData,
    getWishlistData,
    GooglAuthLogin,
    GooglAuthRegister,
    Payment,
    PaymentHistory,
    PaymentSuccess,
    registerUser,
    ResendOtp,
    ReserveProperty,
    resetPassword,
    ShareProperty,
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
router.get('/property/:id', UserAuth, GetProperty)
router.get('/property', UserAuth, GetPropertyData)
router.post('/property/bookproperty/:id', UserAuth, CheckIsBooked)
router.post('/property/paymentreq/:id', UserAuth, Payment)
router.post('/property/success/:id', UserAuth, PaymentSuccess)
router.get('/paymenthistory', UserAuth, PaymentHistory)
router.post('/paymenthistory/:id', UserAuth, cancelPayment)
router.post('/resendotp', ResendOtp)
router.get('/getprofiledata/:id',UserAuth, GetProfileData)
router.get('/properties/:page', GetPaginateProperty);
router.post('/wishlist', AddToWishlist);
router.get('/wishlistdata',UserAuth, getWishlistData);
router.post('/profileimage/:id', AddProfileImage);
router.put('/editprofile/:id', EditProfileData);
router.post('/reserve/:propertyId', ReserveProperty);
router.get('/enquiry',UserAuth, FetchReservations);
router.post('/shareproperty/:propId', ShareProperty);
router.get('/fetchcategory', FetchCategory);
router.get('/propertiesData/:id', getPropertyData);


export default router

