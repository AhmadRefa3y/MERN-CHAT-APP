import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
export interface AuthRequest extends Request {
    user?: any;
}

export const protectRoute = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log(process.env.NODE_ENV);
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({
                message: "Unauthorized - No Token Provided",
            });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userID: string;
        };
        if (!decoded) {
            res.status(401).json({ message: "Unauthorized - Invalid Token" });
            return;
        }

        const user = await User.findById(decoded.userID).select("-password");

        if (!user) {
            res.status(401).json({ message: "No user Found" });
            return;
        }
        req.user = user;
        next();
    } catch (error: any) {
        console.error("Error in auth middleware", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};
