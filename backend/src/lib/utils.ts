import { Types } from "mongoose";
import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userID: any, res: Response) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET as any, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};
