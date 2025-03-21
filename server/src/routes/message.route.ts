import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { sendMessage, getAllMessagesForARoom } from "../controllers/message.controller.js";

const router = express.Router();

router.post('/send', authMiddleware, sendMessage);
router.get('/:roomId', authMiddleware, getAllMessagesForARoom);


export default router