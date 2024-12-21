import express from "express";
import {
  checkAuth,
  loginController,
  logoutController,
  signupController,
  updateProfile,
} from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

const AuthRouter = express.Router();

AuthRouter.post("/signup", signupController);
AuthRouter.post("/login", loginController);
AuthRouter.get("/logout", logoutController);
AuthRouter.put("/update-profile", protectRoute, updateProfile);
AuthRouter.get("/check", protectRoute, checkAuth);

export default AuthRouter;
