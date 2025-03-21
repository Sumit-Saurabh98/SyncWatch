import express from "express";
import { createRoom, deleteRoom, getAllRooms, getRoomById, getRoomJoinedByUser, getRoomsCreatedByUser, joinPrivateRoom, joinPublicRoom, leaveRoom, makeRoomPrivate, makeRoomPublic, changeRoomName, changeRoomDescription, changeRoomVideoUrl } from "../controllers/room.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authorizeMiddleware } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.patch("/make-public/:roomId", authMiddleware, authorizeMiddleware(), makeRoomPublic);
router.patch("/make-private/:roomId", authMiddleware, authorizeMiddleware(), makeRoomPrivate);
router.get('/created-by-user', authMiddleware, getRoomsCreatedByUser);
router.get('/joined-by-user', authMiddleware, getRoomJoinedByUser);
router.get('/all', authMiddleware, getAllRooms);
router.get('/:roomId', authMiddleware, getRoomById);
router.post('/join-public/:roomId', authMiddleware, joinPublicRoom);
router.post('/join-private/:roomId', authMiddleware, joinPrivateRoom);
router.post('/leave/:roomId', authMiddleware, leaveRoom);
router.patch('/name-change/:roomId', authMiddleware, authorizeMiddleware(), changeRoomName);
router.patch('/description-change/:roomId', authMiddleware, authorizeMiddleware(), changeRoomDescription);
router.patch('/video-url-change/:roomId', authMiddleware, authorizeMiddleware(), changeRoomVideoUrl);
router.delete('/delete/:roomId', authMiddleware, authorizeMiddleware(), deleteRoom);




export default router;
