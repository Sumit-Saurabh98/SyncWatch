import { Application, Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js"
import roomRoutes from "./routes/room.route.js"
import messageRoutes from "./routes/message.route.js"
import connectDB from "./config/db.js";



const app: Application = express();
const PORT = process.env.PORT || 5001;

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.get("/test", (req:Request, res:Response) => {
    res.send("Server is working....")
})

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/room', roomRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error, "error connecting to database");
});
