import {
  createConversation,
  getConversations,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middlewares/auth/auth.middleware.js";

import { Router } from "express";

export const conversationRouter = Router();

conversationRouter.post("/", verifyToken, createConversation);
conversationRouter.get("/", verifyToken, getConversations);
