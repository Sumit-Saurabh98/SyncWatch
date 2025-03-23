import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getProfile, updateName, updateProfilePicture } from "../controllers/user.controller.js";

const router = express.Router();

router.patch('/update-name', authMiddleware, updateName);
router.patch('/update-profile-picture', authMiddleware, updateProfilePicture);
router.get('/profile', authMiddleware, getProfile);

export default router