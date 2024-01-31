import express from  "express"
import { getuserDetails, loginAdmin, getOwnerDetails, ListCategory, getCategoryDetails, UserblockHandle, OwnerblockHandle } from "../controllers/admin_controller.js"
const router = express.Router()


router.post('/admin/login', loginAdmin)
router.get('/users', getuserDetails)
router.get('/owners', getOwnerDetails)
router.post('/admin/category', ListCategory)
router.get('/category', getCategoryDetails)
router.post('/admin/userlist/:id', UserblockHandle)
router.post('/admin/ownerlist/:id', OwnerblockHandle)

export default router