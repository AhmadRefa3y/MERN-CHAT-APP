import express, { Request, Response } from "express";
import AuthRouter from "./routes/auth.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import MessageRouter from "./routes/messages.route";
import cors from "cors";
import { app, server } from "./lib/socket";
import path from "path";
const PORT = process.env.PORT || 3001;

// Middleware
dotenv.config();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3001",
            "https://mern-chat-app-frontend-six.vercel.app",
        ],
        credentials: true,
    })
);
// Routes
app.use("/nody", (req: Request, res: Response) => {
    res.status(200).json({ message: "I LOVE You" });
});
app.use("/api/auth", AuthRouter);
app.use("/api/messages", MessageRouter);

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
    const staticPath = path.join(process.cwd(), "../frontend/dist");
    console.log(staticPath);
    app.use(express.static(staticPath));
    app.get("*", (req: Request, res: Response) => {
        // res.status(200).json({ message: "NOT NOW" });
        res.sendFile(path.join(staticPath, "index.html"));
    });
}

// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
