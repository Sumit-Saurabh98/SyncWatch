import { Request, Response } from "express";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import { thumbnailGenerator } from "../utils/thumbnailGenerator.js";
import { videoIdExtractor } from "../utils/videoIdExtractor.js";

export const createRoom = async (req: Request, res: Response): Promise<void> => {
    const {name, description, videoUrl, category, startDateTime} = req.body;

    if( !name || !description || !videoUrl || !category || !startDateTime) {
        res.status(400).json({success: false, message: "All fields are required"});
        return;
    }

    try {
        const existingRoom = await Room.findOne({name});

        if(existingRoom) {
            res.status(400).json({success: false, message: "Room already exists with this name"});
            return;
        }
        const {maxResolution} = thumbnailGenerator(videoUrl);
        const videoId = videoIdExtractor(videoUrl);
        const room = await Room.create({name, description, videoUrl, thumbnailUrl: maxResolution, videoId, category, startDateTime, createdBy: req.user._id, participants: [{userId:req.user._id, role: 'host'}]});

        const user = await User.findById(req.user._id);

        if(!user) {
            res.status(400).json({success: false, message: "User not found"});
            return;
        }

        user.createdRooms.push(room._id);
        await user.save();

        res.status(201).json({success: true, message: "Room created successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const makeRoomPrivate = async (req: Request, res: Response): Promise<void> => {
    const {accessCode} = req.body;
    const {roomId} = req.params;

    if( !roomId || !accessCode) {
        res.status(400).json({success: false, message: "All fields are required"});
        return;
    }

    try {
        const existingRoom = await Room.findOne({_id: roomId});

        if(!existingRoom) {
            res.status(400).json({success: false, message: "Room not found"});
            return;
        }
        
        if(existingRoom.createdBy.toString() !== req.user._id.toString()) {
            res.status(403).json({success: false, message: "You are not authorized to make this room private"});
            return;
        }

        existingRoom.isPrivate = true;
        existingRoom.accessCode = accessCode;
        const room = await existingRoom.save();

        res.status(201).json({success: true, message: "Room created successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});   
    }
}

export const makeRoomPublic = async (req: Request, res: Response): Promise<void> => {
    const {roomId} = req.params;

    if( !roomId) {
        res.status(400).json({success: false, message: "All fields are required"});
        return;
    }

    try {
        const existingRoom = await Room.findOne({_id: roomId});

        if(!existingRoom) {
            res.status(400).json({success: false, message: "Room not found"});
            return;
        }
        
        if(existingRoom.createdBy.toString() !== req.user._id.toString()) {
            res.status(403).json({success: false, message: "You are not authorized to make this room public"});
            return;
        }

        existingRoom.isPrivate = false;
        existingRoom.accessCode = "";
        const room = await existingRoom.save();

        res.status(201).json({success: true, message: "Room created successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});   
    }
}

export const getRoomsCreatedByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id)
      .populate({
        path: 'createdRooms',
        populate: {
          path: 'createdBy',
          select: 'name email profilePicture' // Select only the fields you need
        }
      });

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
  
      // Extract the populated rooms from the user object
      const rooms = user.createdRooms;

        res.status(200).json({success: true, message: "Rooms fetched successfully", rooms});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getRoomJoinedByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user._id)
      .populate({
        path: 'joinedRooms',
        populate: {
          path: 'createdBy',
          select: 'name email profilePicture' // Select only the fields you need
        }
      });

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
  
      // Extract the populated rooms from the user object
      const rooms = user.joinedRooms;

        res.status(200).json({success: true, message: "Rooms fetched successfully", rooms});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        const rooms = await Room.find().populate({
            path: 'createdBy',
            select: 'name profilePicture'
        });
        res.status(200).json({success: true, message: "Rooms fetched successfully", rooms});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
    const {roomId} = req.params;

    if(!roomId) {
        res.status(400).json({success: false, message: "Room id is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }

        res.status(200).json({success: true, message: "Room fetched successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const joinPublicRoom = async (req: Request, res: Response): Promise<void> => {
    const {roomId} = req.params;

    if(!roomId) {
        res.status(400).json({success: false, message: "Room id is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }

        if(room.isPrivate) {
            res.status(400).json({success: false, message: "Room is private"});
            return;
        }

        const participant = {
            userId: req.user._id,
            role: 'participant'
        }

        if(room.participants.some(participant => participant.userId.toString() === req.user._id.toString())) {
            res.status(400).json({success: false, message: "You are already a participant of this room"});
            return;
        }

        room.participants.push(participant);
        await room.save();

        const user = await User.findById(req.user._id);
        if(!user) {
            res.status(400).json({success: false, message: "User not found"});
            return;
        }
        user.joinedRooms.push(room._id);
        await user.save();

        res.status(200).json({success: true, message: "Room joined successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const joinPrivateRoom = async (req: Request, res: Response): Promise<void> => {
    const {accessCode} = req.body;
    const {roomId} = req.params;

    if(!roomId || !accessCode) {
        res.status(400).json({success: false, message: "Access code are required to join private room"});
        return;
    }

    try {
        const room = await Room.findById(roomId);    
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }

        if(!room.isPrivate) {
            res.status(400).json({success: false, message: "Room is public"});
            return;
        }

        if(room.accessCode !== accessCode) {
            res.status(400).json({success: false, message: "Invalid access code"});
            return;
        }

        if(room.participants.some(participant => participant.userId.toString() === req.user._id.toString())) {
            res.status(400).json({success: false, message: "You are already a participant of this room"});
            return;
        }

        const participant = {
            userId: req.user._id,
            role: 'participant'
        }

        room.participants.push(participant);

        await room.save();

        const user = await User.findById(req.user._id);
        if(!user) {
            res.status(400).json({success: false, message: "User not found"});
            return;
        }
        user.joinedRooms.push(room._id);
        await user.save();

        res.status(200).json({success: true, message: "Room joined successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const leaveRoom = async (req: Request, res: Response): Promise<void> => {
    const {roomId} = req.params;

    if(!roomId) {
        res.status(400).json({success: false, message: "Room id is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }

        const participant = room.participants.find(participant => participant.userId.toString() === req.user._id.toString());

        if(!participant) {
            res.status(400).json({success: false, message: "You are not a participant of this room"});
            return;
        }

        if(participant.role === 'host') {
            res.status(400).json({success: false, message: "Host cannot leave the room"});
            return;
        }

        const user = await User.findById(req.user._id);
        if(!user) {
            res.status(400).json({success: false, message: "User not found"});
            return;
        }
        user.joinedRooms = user.joinedRooms.filter(roomId => roomId.toString() !== room._id.toString());
        await user.save();

        room.participants = room.participants.filter(participant => participant.userId.toString() !== req.user._id.toString());

        await room.save();

        res.status(200).json({success: true, message: "Room left successfully", room});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const changeRoomName = async (req: Request, res: Response): Promise<void> => {
    const {name} = req.body;
    const {roomId} = req.params;

    if(!name) {
        res.status(400).json({success: false, message: "Name is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }
        room.name = name;
        await room.save();
        res.status(200).json({success: true, message: "Room name changed successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const changeRoomDescription = async (req: Request, res: Response): Promise<void> => {
    const {description} = req.body;
    const {roomId} = req.params;

    if(!description) {
        res.status(400).json({success: false, message: "Description is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }
        room.description = description;
        await room.save();
        res.status(200).json({success: true, message: "Room description changed successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const changeRoomVideoUrl = async (req: Request, res: Response): Promise<void> => {
    const {videoUrl} = req.body;
    const {roomId} = req.params;

    if(!videoUrl) {
        res.status(400).json({success: false, message: "Video URL is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }
        const {maxResolution} = thumbnailGenerator(videoUrl);
        room.videoUrl = videoUrl;
        room.thumbnailUrl = maxResolution;
        await room.save();
        res.status(200).json({success: true, message: "Room video URL changed successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
    const {roomId} = req.params;

    if(!roomId) {
        res.status(400).json({success: false, message: "Room id is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }

        if(room.createdBy.toString() !== req.user._id.toString()) {
            res.status(403).json({success: false, message: "You are not authorized to delete this room"});
            return;
        }

        // before deleting the room, remove the room from the user's joined rooms and createdBy user's created rooms
        const user = await User.findById(req.user._id);
        if(!user) {
            res.status(400).json({success: false, message: "User not found"});
            return;
        }
        user.createdRooms = user.createdRooms.filter(roomId => roomId.toString() !== room._id.toString());
        user.joinedRooms = user.joinedRooms.filter(roomId => roomId.toString() !== room._id.toString());
        await user.save();

        await Room.findByIdAndDelete(roomId);

        res.status(200).json({success: true, message: "Room deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const changeVideoState = async (req: Request, res: Response): Promise<void> => {
    const {roomId} = req.params;
    const {isPlaying, playbackRate, seekTo} = req.body;

    if(!roomId) {
        res.status(400).json({success: false, message: "Room id is required"});
        return;
    }

    try {
        const room = await Room.findById(roomId);
        if(!room) {
            res.status(404).json({success: false, message: "Room not found"});
            return;
        }
        room.videoState.isPlaying = isPlaying;
        room.videoState.playbackRate = playbackRate;
        room.videoState.seekTo = seekTo;
        await room.save();
        res.status(200).json({success: true, message: "Video state changed successfully", room});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}