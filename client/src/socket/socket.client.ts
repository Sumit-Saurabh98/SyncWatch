import io, { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:6006";

let socket: Socket | undefined;

export const initializeSocket = (userId: string) => {
    if(socket){
        socket.disconnect();
    }

    socket = io(SOCKET_URL, {
        query: {
            userId,
        },
    });
}

export const getSocket = () => {
    if(!socket){
        throw new Error("Socket is not initialized");
    }

    return socket;
}

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect();
    }
}

