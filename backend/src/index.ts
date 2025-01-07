import express, { Request, Response } from "express";
import AuthRouter from "./routes/auth.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import MessageRouter from "./routes/messages.route";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
dotenv.config();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/messages", MessageRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
