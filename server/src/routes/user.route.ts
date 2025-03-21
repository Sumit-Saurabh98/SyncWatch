import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { updateName, updateProfilePicture } from "../controllers/user.controller.js";

const router = express.Router();

router.patch('/update-name', authMiddleware, updateName);
router.patch('/update-profile-picture', authMiddleware, updateProfilePicture);

export default router