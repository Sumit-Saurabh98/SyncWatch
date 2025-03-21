import { Request, Response, NextFunction } from "express";
import Room from "../models/room.model.js";

export const authorizeMiddleware = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {roomId} = req.params;
    if (!roomId) {
      res.status(400).json({ success: false, message: "Room id is required" });
      return;
    }

    try {
      const room = await Room.findById(roomId);
      if (!room) {
        res.status(404).json({ success: false, message: "Room not found" });
        return;
      }

      if (room.createdBy.toString() !== req.user._id.toString()) {
        res.status(403).json({
          success: false,
          message: "You are not authorized to make this room public",
        });
        return;
      }

      next();
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
};
