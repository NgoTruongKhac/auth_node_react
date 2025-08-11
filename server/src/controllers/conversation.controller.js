import ErrorHandler from "../middlewares/errors/ErrorHandler.js";
import { Conversation } from "../models/conversation.model.js";

export const createConversation = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const userId = req.userId;

    if (!recipientId || !content) {
      throw new ErrorHandler("recipientId and content are required", 400);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, recipientId],
        lastMessage: {
          content,
          senderId: userId,
          createdAt: new Date(),
        },
      });
    } else {
      conversation.lastMessage = {
        content,
        senderId: userId,
        createdAt: new Date(),
      };
      await conversation.save();
    }

    return res.status(201).json({
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        match: { _id: { $ne: userId } },
        select: "username profilePicture",
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
