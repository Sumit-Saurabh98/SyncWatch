// now message controller

import { Request, Response } from "express";
import Message from "../models/message.schema.js";
import Room from "../models/room.model.js";
import { getIO } from "../socket/socket.client.js";

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { message } = req.body;
  const { roomId } = req.params;

  if (!roomId || !message) {
    res
      .status(400)
      .json({ success: false, message: "Room id and message are required" });
    return;
  }

  try {
    // check user is the part of that room first
    const room = await Room.findById(roomId);

    if (!room) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }

    const participant = room.participants.find(
      (participant) => participant.userId.toString() === req.user._id.toString()
    );

    if (!participant) {
      res
        .status(400)
        .json({
          success: false,
          message: "You are not a participant of this room",
        });
      return;
    }

    const newMessage = await Message.create({
      roomId,
      message,
      sender: req.user._id,
    });
    
    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name profilePicture");

    if (!populatedMessage) {
      res.status(400).json({ success: false, message: "Message not created" });
      return;
    }

    room.messages.push(populatedMessage._id);
    await room.save();

    // real time with socket.io
    // real time with socket.io
    const io = getIO();
    io.to(roomId).emit("new_message", populatedMessage, { broadcast: true });

    res
      .status(201)
      .json({
        success: true,
        message: "Message created successfully",
        newMessage,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllMessagesForARoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { roomId } = req.params;

  if (!roomId) {
    res.status(400).json({ success: false, message: "Room id is required" });
    return;
  }

  try {
    const messages = await Message.find({ roomId })
      .populate("sender", "name profilePicture")
      .sort({ createdAt: 1 });
    res
      .status(200)
      .json({
        success: true,
        message: "Messages fetched successfully",
        messages,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
