import express, { Request, Response } from "express";
import AuthRouter from "./routes/auth.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
dotenv.config();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", AuthRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
