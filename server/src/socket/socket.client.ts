import { Server } from "socket.io";
import http from "http";

declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}

let io: Server | undefined;

// Map to track users in each room: roomId -> array of socketIds
const usersInRoom: Map<string, string[]> = new Map();

export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.query.userId as string;
    if (!userId) {
      return next(new Error("Invalid user ID"));
    }

    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);
    console.log(usersInRoom, "ye saale log room me baithe hain")

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      // console.log(usersInRoom, "ye saale log room me baithe hain")

      // Initialize room users array if it doesn't exist
      if (!usersInRoom.has(roomId)) {
        usersInRoom.set(roomId, []);
      }
      
      // Add user to room
      usersInRoom.get(roomId)?.push(socket.id);
      
      // Emit updated user list to everyone in the room
      io?.to(roomId).emit('updated_user_list', usersInRoom.get(roomId));
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected with socket ID: ${socket.id}`);
      
      // Find and remove user from all rooms they were in
      for (const [roomId, users] of usersInRoom.entries()) {
        const socketIndex = users.indexOf(socket.id);
        
        if (socketIndex !== -1) {
          // Remove user from room
          users.splice(socketIndex, 1);
          
          // Notify remaining users in the room
          io?.to(roomId).emit('updated_user_list', users);
          
          console.log(`User ${socket.id} removed from room ${roomId}`);
          
          // Clean up empty rooms
          if (users.length === 0) {
            usersInRoom.delete(roomId);
            console.log(`Room ${roomId} is now empty and has been removed`);
          }
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket is not initialized");
  }
  return io;
};

export const getUsersInRoom = () => usersInRoom;