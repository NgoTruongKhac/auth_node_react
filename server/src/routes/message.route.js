import { getMessages } from "../controllers/message.controller.js";
import { Router } from "express";
export const messageRouter = Router();
messageRouter.get("/:conversationId", getMessages);
