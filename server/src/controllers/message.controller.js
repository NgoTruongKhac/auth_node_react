import { Message } from "../models/message.model.js";

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    const messages = await Message.find({ conversationId })
      .select("senderId content createdAt")
      .populate("senderId", "username profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
