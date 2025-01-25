import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/user.model";

export const searchUserByEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email }).select(
      "fullName email profilePic"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error in searchUserByEmail:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addContact = async (req: AuthRequest, res: Response) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;

    // Check if user exists
    const contactUser = await User.findById(contactId);
    if (!contactUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Add contact to user's contacts list
    await User.findByIdAndUpdate(userId, {
      $addToSet: { contacts: contactId },
    });

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error: any) {
    console.error("Error in addContact:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getContacts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "contacts",
      "fullName email profilePic"
    );

    res.status(200).json(user?.contacts || []);
  } catch (error: any) {
    console.error("Error in getContacts:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
