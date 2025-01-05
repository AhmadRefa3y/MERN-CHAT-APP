import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/messages.controller";

const MessageRouter = Router();

MessageRouter.get("/users", protectRoute, getUsersForSidebar);
MessageRouter.get("/:id", protectRoute, getMessages);
MessageRouter.post("/send/:id", protectRoute, sendMessage);
export default MessageRouter;
