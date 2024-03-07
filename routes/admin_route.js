import express from "express"
import {
    getuserDetails,
    loginAdmin,
    getOwnerDetails,
    ListCategory,
    getCategoryDetails,
    UserblockHandle,
    OwnerblockHandle,
    ListKyc, 
    handleBlockCategory,
    getPropertydetails,
    PropertyStatusUpdate,
    getBookingData,
    PropertyDetails,
    EditCategory,
    GetPaginateProperty,
    KycApproval
} from "../controllers/AdminController.js"
import { AdminAuth } from '../Middleware/AdminAuth.js'

const router = express.Router()


router.post('/admin/login', loginAdmin)
router.get('/users', getuserDetails)
router.get('/owners', AdminAuth, getOwnerDetails)
router.post('/admin/category', AdminAuth, ListCategory)
router.get('/category', AdminAuth, getCategoryDetails)
router.patch('/admin/userlist/:id',AdminAuth, UserblockHandle)
router.patch('/admin/ownerlist/:id', OwnerblockHandle)
router.get('/kyclist', AdminAuth, ListKyc)
router.patch('/approveKyc/:id', KycApproval)
router.patch('/admin/category/:id', handleBlockCategory)
router.get('/propertylist', AdminAuth, getPropertydetails)
router.post('/propertystatus/:id', PropertyStatusUpdate)
router.get('/bookingsdata', AdminAuth, getBookingData)
router.get('/propertylist/:id', AdminAuth, PropertyDetails)
router.patch('/admin/editcategory/:id', AdminAuth, EditCategory)
router.get('/properties/:page', GetPaginateProperty);



export default router