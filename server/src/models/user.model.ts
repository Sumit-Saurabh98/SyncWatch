import mongoose from "mongoose";
import { IUser } from "../utils/interfaces";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    joinedRooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
    ],
    createdRooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
    ]
}, {timestamps: true});

const User = mongoose.model<IUser>("User", userSchema);

export default User;