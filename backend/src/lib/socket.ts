import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://mern-chat-app-frontend-six.vercel.app",
            "http://localhost:5173",
            "http://localhost:3001",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});
interface UserSocketMap {
    [key: string]: any;
}

export const getRecieverSocketId = (userId: string) => {
    return userSocketMap[userId];
};
const userSocketMap: UserSocketMap = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId as string] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("typing", (reciverID) => {
        console.log(`User ${userId} is typing... to ${reciverID}`);
        const reciverSocketID = getRecieverSocketId(reciverID);
        io.to(reciverSocketID).emit("userTyping", userId);
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete userSocketMap[userId as string];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };
