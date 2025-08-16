import { Notification } from "../models/notification.model.js";

export const createNotification = async (req, res, next) => {
  try {
    const { recipientId, senderId, conversationId, content } = req.body;

    const newNotification = new Notification({
      recipient: recipientId,
      sender: senderId,
      conversationId: conversationId,
      content: content,
    });
    await newNotification.save();
    res.status(201).json({
      message: "Notification created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.userId;

    const notifications = await Notification.find({
      recipient: userId,
    })
      .populate("sender", "username profilePicture")
      .populate({
        path: "conversationId",
        populate: {
          path: "participants",
          match: { _id: { $ne: userId } }, // loại bỏ current
          select: "username profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const setNotificationRead = async (req, res, next) => {
  try {
    const userId = req.userId;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: "Notifications marked as read successfully",
    });
  } catch (error) {
    next(error);
  }
};
