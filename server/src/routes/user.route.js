import {
  getMe,
  updateProfilePicture,
  getUsersByEmail,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyToken } from "../middlewares/auth/auth.middleware.js";
import { uploadProfilePicture } from "../middlewares/multer/multer.middleware.js";

export const userRouter = Router();

userRouter.get("/search/:email", getUsersByEmail);
userRouter.get("/me", verifyToken, getMe);
userRouter.post(
  "/update-profile-picture",
  verifyToken,
  uploadProfilePicture.single("file"),
  updateProfilePicture
);
