import mongoose from "mongoose";
import { IRoom } from "../utils/interfaces.js";
import { Categories } from "../utils/roomEnum.js";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(Categories),
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    accessCode: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["host", "participant"],
          default: "participant",
        },
      },
    ],
    videoState: {
      currentTime: {
        type: Number,
        default: 0,
      },
      isPlaying: {
        type: Boolean,
        default: false,
      },
      lastUpdated: {
        type: Date,
        default: Date.now(),
      },
    }
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
