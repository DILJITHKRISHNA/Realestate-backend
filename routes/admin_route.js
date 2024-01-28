import express from  "express"
import { getuserDetails, loginAdmin } from "../controllers/admin_controller.js"
const router = express.Router()


router.post('/admin/login', loginAdmin)
router.get('/users', getuserDetails)

export default router