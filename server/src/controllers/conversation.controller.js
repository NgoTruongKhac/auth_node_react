import ErrorHandler from "../middlewares/errors/ErrorHandler.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const createConversation = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.userId; // Lấy từ middleware xác thực

    if (!recipientId || !content) {
      return next(
        new ErrorHandler(
          "Recipient ID and first message content are required",
          400
        )
      );
    }

    // Tìm xem conversation đã tồn tại chưa để tránh tạo trùng lặp
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    // Nếu chưa có, tạo mới
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        // lastMessage sẽ được cập nhật sau khi tạo message
      });
    }

    // Tạo tin nhắn đầu tiên
    const newMessage = new Message({
      conversationId: conversation._id,
      senderId,
      content,
    });

    // Cập nhật lastMessage cho conversation
    conversation.lastMessage = {
      content: newMessage.content,
      senderId: newMessage.senderId,
      createdAt: newMessage.createdAt,
    };

    // Lưu cả hai vào DB (có thể dùng transaction để đảm bảo an toàn)
    await Promise.all([conversation.save(), newMessage.save()]);

    // Populate thông tin người tham gia để trả về cho client
    const populatedConversation = await Conversation.findById(
      conversation._id
    ).populate({
      path: "participants",
      match: { _id: { $ne: req.userId } }, // loại bỏ current user
      select: "username profilePicture",
    });

    // TODO: Gửi sự kiện socket tới recipientId để họ biết có cuộc trò chuyện mới

    return res.status(201).json(populatedConversation);
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

export const getConversationById = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId).populate({
      path: "participants",
      match: { _id: { $ne: userId } },
      select: "username profilePicture",
    });

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};
