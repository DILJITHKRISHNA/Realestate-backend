import express from "express"
import {
    getuserDetails,
    loginAdmin,
    getOwnerDetails,
    ListCategory,
    getCategoryDetails,
    UserblockHandle,
    OwnerblockHandle,
    ListKyc, OwnerApproval,
    handleBlockCategory,
    getPropertydetails,
    PropertyStatusUpdate,
    getBookingData,
    PropertyDetails
} from "../controllers/AdminController.js"
const router = express.Router()


router.post('/admin/login', loginAdmin)
router.get('/users', getuserDetails)
router.get('/owners', getOwnerDetails)
router.post('/admin/category', ListCategory)
router.get('/category', getCategoryDetails)
router.post('/admin/userlist/:id', UserblockHandle)
router.post('/admin/ownerlist/:id', OwnerblockHandle)
router.get('/kyclist', ListKyc)
router.get('/approveKyc/:id', OwnerApproval)
router.post('/admin/category/:id', handleBlockCategory)
router.get('/propertylist', getPropertydetails)
router.post('/propertystatus/:id', PropertyStatusUpdate)
router.get('/bookingsdata', getBookingData)
router.get('/propertylist/:id', PropertyDetails)



export default router