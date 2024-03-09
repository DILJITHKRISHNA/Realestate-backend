import express from "express";
import { GetMessage, SendMessage } from "../controllers/MessageController.js";
import { UserAuth } from "../Middleware/UserAuth.js";
const router = express.Router()
router.post("/sendmessages/:userId",UserAuth, SendMessage)
router.get("/getmessages/:id",UserAuth, GetMessage)

export default router