import { Server } from "socket.io";
import { CLIENT_DOMAIN } from "./env.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Notification } from "../models/notification.model.js";

export const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_DOMAIN,
      methods: ["GET", "POST"],
    },
  });

  let onlineUsers = {};

  const addUser = (userId, socketId) => {
    onlineUsers[userId] = socketId;
  };
  const removeUser = (socketId) => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socketId) {
        delete onlineUsers[userId];
        break;
      }
    }
  };

  // const getOnlineUser = (userId) => {
  //   return onlineUsers[userId];
  // };

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", onlineUsers);
    });

    // MỚI: Sự kiện để tham gia vào một phòng trò chuyện
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation: ${conversationId}`);
    });

    socket.on("sendMessage", async ({ senderId, content, conversationId }) => {
      try {
        // ... (lưu tin nhắn, cập nhật conversation, gửi getMessage vẫn như cũ)
        const newMessage = new Message({
          conversationId,
          senderId,
          content,
        });
        const savedMessage = await newMessage.save();

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: {
            content: savedMessage.content,
            senderId: savedMessage.senderId,
            createdAt: savedMessage.createdAt,
          },
        });

        const messageToSend = await savedMessage.populate(
          "senderId",
          "username profilePicture"
        );

        io.to(conversationId).emit("getMessage", messageToSend);

        // =============================================================
        // --- BẮT ĐẦU LOGIC MỚI: GỬI THÔNG BÁO (NOTIFICATION) ---
        // =============================================================

        // BƯỚC 1: Lấy tất cả người tham gia và các socket đang trong phòng chat
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        // Lấy Set chứa các socket.id đang trong phòng `conversationId`
        // Dùng `|| new Set()` để tránh lỗi nếu phòng không tồn tại hoặc trống
        const socketsInRoom =
          io.sockets.adapter.rooms.get(conversationId) || new Set();

        // BƯỚC 2: Lọc ra những người nhận thông báo
        const notificationRecipients = conversation.participants.filter(
          (participantId) => {
            const pIdString = participantId.toString();

            // Điều kiện 1: Loại trừ người gửi tin nhắn
            if (pIdString === senderId.toString()) {
              return false;
            }

            // Điều kiện 2: Loại trừ những người đang trong phòng chat
            const participantSocketId = onlineUsers[pIdString];
            if (participantSocketId && socketsInRoom.has(participantSocketId)) {
              // Nếu người dùng này online VÀ socket của họ đang ở trong phòng,
              // không gửi thông báo
              return false;
            }

            // Nếu qua được 2 điều kiện trên thì gửi thông báo
            return true;
          }
        );

        // BƯỚC 3: Lặp qua và gửi thông báo nếu họ online
        notificationRecipients.forEach((recipientId) => {
          const recipientSocketId = onlineUsers[recipientId.toString()];

          if (recipientSocketId) {
            console.log(
              `Sending notification to user ${recipientId} at socket ${recipientSocketId}`
            );

            // Tạo thông báo
            const notification = new Notification({
              recipient: recipientId,
              sender: senderId,
              conversationId: conversationId,
              content: content,
            });
            notification.save();

            io.to(recipientSocketId).emit("getNotification", {
              recipient: recipientId,
              sender: messageToSend.senderId,
              conversationId: conversationId,
              content: content,
            });
          }
        });
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    socket.on("sendFirstMessage", ({ senderId, recipientId, content }) => {
      const recipientSocketId = onlineUsers[recipientId.toString()];
      io.to(recipientSocketId).emit("getNotification", {
        sender: senderId,
        recipient: recipientId,
        content: content,
      });
    });

    // Trong file socket.js
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", onlineUsers);
    });
  });
};
