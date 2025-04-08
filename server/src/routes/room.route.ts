import express from "express";
import { createRoom, deleteRoom, getAllRooms, getRoomById, getRoomJoinedByUser, getRoomsCreatedByUser, joinPrivateRoom, joinPublicRoom, leaveRoom, changeVideoState, updateRoom } from "../controllers/room.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authorizeMiddleware } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get('/created-by-user', authMiddleware, getRoomsCreatedByUser);
router.get('/joined-by-user', authMiddleware, getRoomJoinedByUser);
router.get('/all', authMiddleware, getAllRooms);
router.get('/:roomId', authMiddleware, getRoomById);
router.post('/join-public/:roomId', authMiddleware, joinPublicRoom);
router.post('/join-private/:roomId', authMiddleware, joinPrivateRoom);
router.post('/leave/:roomId', authMiddleware, leaveRoom);
router.put('/update/:roomId', authMiddleware, authorizeMiddleware(), updateRoom);
router.delete('/delete/:roomId', authMiddleware, authorizeMiddleware(), deleteRoom);
router.put('/change-video-state/:roomId', authMiddleware, changeVideoState);




export default router;
