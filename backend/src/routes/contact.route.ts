import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  searchUserByEmail,
  addContact,
  getContacts,
} from "../controllers/contact.controller";

const ContactRouter = Router();

ContactRouter.get("/search", protectRoute, searchUserByEmail);
ContactRouter.post("/add", protectRoute, addContact);
ContactRouter.get("/", protectRoute, getContacts);

export default ContactRouter;
