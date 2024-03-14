import express from 'express'
import { createChat, findChat, ownerChats, userChats } from '../controllers/ChatController.js'

const router = express.Router()
router.post("/", createChat)
router.get("/:userId", userChats)
router.get("/getownerchat/:ownerId", ownerChats);
router.get("/find/:firstId/:secondId", findChat)

export default router