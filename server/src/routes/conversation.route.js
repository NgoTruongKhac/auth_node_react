import {
  createConversation,
  getConversations,
  getConversationById,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middlewares/auth/auth.middleware.js";

import { Router } from "express";

export const conversationRouter = Router();

conversationRouter.get("/:conversationId", verifyToken, getConversationById);
conversationRouter.post("/", verifyToken, createConversation);
conversationRouter.get("/", verifyToken, getConversations);
