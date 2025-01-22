import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import { AuthRequest } from "../middleware/auth.middleware";
import cloudinary from "../lib/cloudinary";

export const signupController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email, fullName, password } = req.body;
    try {
        // Check for required fields
        if (!email || !fullName || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Check password length
        if (password.length < 6) {
            res.status(400).json({
                message: "Password must be at least 6 characters",
            });
            return;
        }

        // Check if user exists
        const findUser = await User.findOne({ email });
        if (findUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        // Save user and generate token
        await newUser.save();
        generateToken(newUser._id, res);
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
        });
    } catch (error: any) {
        console.error("Error in Signup controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Invalid Credentilas" });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password!
        );
        if (!isPasswordCorrect) {
            res.status(404).json({ message: "Invalid Credentilas" });
            return;
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    } catch (error: any) {
        console.error("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};
export const logoutController = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        res.status(200).json({ message: "Logged out sucessfully" });
    } catch (error: any) {
        console.error("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { profilePic } = req.body;

        const userId = req.user._id;

        if (!profilePic) {
            res.status(404).json({ message: "Profile Pic is required" });
            return;
        }

        const uploaderRes = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploaderRes.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const checkAuth = (req: AuthRequest, res: Response) => {
    try {
        console.log(process.env.NODE_ENV);
        res.status(200).json(req.user);
    } catch (error: any) {
        console.error("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error", error });
    }
};
