import { Application, Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import passport from './config/passport.js';
import session from 'express-session';
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js"
import roomRoutes from "./routes/room.route.js"
import messageRoutes from "./routes/message.route.js"
import connectDB from "./config/db.js";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket.client.js";

const PORT = process.env.PORT || 5001;
dotenv.config();

const app: Application = express();
const server = createServer(app);

initializeSocket(server);

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.get("/test", (req:Request, res:Response) => {
    res.send("Server is working....")
})

// oauth routes
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure cookies only in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        },
    })
);


  
  app.use(passport.initialize());
  app.use(passport.session());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/room', roomRoutes);

server.listen(PORT, () => {
	console.log("Server started at this port:" + PORT);
	connectDB();
});
