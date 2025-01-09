import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/user.model";
import message from "../models/message.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";

export const getUsersForSidebar = async (req: AuthRequest, res: Response) => {
    try {
        const loggedInUserId = req.user._id;
        const filterdUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(filterdUsers);
    } catch (error: any) {
        console.error("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
        res.status(200).json(messages);
    } catch (error: any) {
        console.error("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { text, image } = req.params;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        // add realtime Functionality
        res.status(201).json(newMessage);
    } catch (error: any) {
        console.error("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};
