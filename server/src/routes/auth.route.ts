import express from "express";
import { register, login, logout, verifyEmail, resendVerificationEmail, resetPasswordToken, updatePassword } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import passport from 'passport';
import { signToken } from "../utils/token.js";
import { setCookie } from "../utils/cookie.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch('/verification', verifyEmail);
router.patch('/resend-verification', resendVerificationEmail);
router.post('/send-password-reset-email', resetPasswordToken);
router.post('/reset-password', updatePassword);
router.post("/logout", authMiddleware, logout);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        if (!req.user) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        }

        const user = req.user as any;
        const token = signToken(user._id);
        setCookie(res, token);

        // Ensure the redirect URL is absolute
        res.redirect(`${process.env.CLIENT_URL}/rooms`);
    }
);



export default router;