import mongoose from "mongoose";
import { IMessage } from "../utils/interfaces";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    }
}, {timestamps: true})

const Message =  mongoose.model<IMessage>("Message", messageSchema)  

export default Message