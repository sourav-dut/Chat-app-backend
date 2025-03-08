import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';
const router = express.Router();

router
    .get("/users", authMiddleware, getUsersForSidebar)
    .get("/:id", authMiddleware, getMessages)
    .post("/send/:id", authMiddleware, sendMessage)

export default router;