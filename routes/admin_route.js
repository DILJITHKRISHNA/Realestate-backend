import express from  "express"
import { getuserDetails, loginAdmin, getOwnerDetails, ListCategory, getCategoryDetails } from "../controllers/admin_controller.js"
const router = express.Router()


router.post('/admin/login', loginAdmin)
router.get('/users', getuserDetails)
router.get('/owners', getOwnerDetails)
router.post('/admin/category', ListCategory)
router.get('/category', getCategoryDetails)

export default router