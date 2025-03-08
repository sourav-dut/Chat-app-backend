import express from 'express';
import { checkAuth, loginUser, logout, otpVerification, registerUser, updateProfile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", otpVerification);
router.post("/logout", logout);

router.put("/update-profile", authMiddleware, updateProfile);
router.get("/check", authMiddleware, checkAuth);

export default router;