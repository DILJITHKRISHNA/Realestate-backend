import express from 'express'
import { addMessage, getMessages } from '../controllers/MessageController.js'
const router = express.Router()

router.post('/chat', addMessage)
router.get('/chat/:chatId', getMessages)

export default router