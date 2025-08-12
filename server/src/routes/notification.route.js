import {
  createNotification,
  getNotifications,
  setNotificationRead,
} from "../controllers/notification.controller.js";

import { Router } from "express";
import { verifyToken } from "../middlewares/auth/auth.middleware.js";

export const notificationRouter = Router();

notificationRouter.post("/", verifyToken, createNotification);
notificationRouter.get("/", verifyToken, getNotifications);
notificationRouter.patch("/", verifyToken, setNotificationRead);
