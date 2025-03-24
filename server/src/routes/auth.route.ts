import express from "express";
import { register, login, logout, verifyEmail, resendVerificationEmail, resetPasswordToken, updatePassword } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch('/verification', verifyEmail);
router.patch('/resend-verification', resendVerificationEmail);
router.post('/send-password-reset-email', resetPasswordToken);
router.post('/reset-password', updatePassword);
router.post("/logout", authMiddleware, logout);

export default router;