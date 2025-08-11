import { Server } from "socket.io";
import { CLIENT_DOMAIN } from "./env.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";

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

    // SỬA: Logic gửi tin nhắn
    socket.on(
      "sendMessage",
      // Bỏ receiverId vì không cần nữa
      async ({ senderId, content, conversationId }) => {
        try {
          const newMessage = new Message({
            conversationId,
            senderId,
            content,
          });
          const savedMessage = await newMessage.save();

          // Cập nhật tin nhắn cuối cùng trong conversation (giữ nguyên)
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: {
              content: savedMessage.content,
              senderId: savedMessage.senderId,
              createdAt: savedMessage.createdAt,
            },
          });

          // Populate thông tin người gửi trước khi gửi đi
          const messageToSend = await savedMessage.populate(
            "senderId",
            "username profilePicture"
          );

          // Gửi tin nhắn đến TẤT CẢ client trong phòng có ID là conversationId
          io.to(conversationId).emit("getMessage", messageToSend);

          // =============================================================
          // --- BẮT ĐẦU LOGIC MỚI: GỬI THÔNG BÁO (NOTIFICATION) ---
          // =============================================================

          // BƯỚC 1: Lấy tất cả người tham gia trong cuộc trò chuyện từ DB
          const conversation = await Conversation.findById(conversationId);
          if (!conversation) return;

          // BƯỚC 2: Lọc ra những người nhận thông báo (tất cả trừ người gửi)
          const notificationRecipients = conversation.participants.filter(
            // Rất quan trọng: Chuyển ObjectId thành string để so sánh
            (participantId) => participantId.toString() !== senderId.toString()
          );

          // BƯỚC 3: Lặp qua và gửi thông báo nếu họ online
          notificationRecipients.forEach((recipientId) => {
            // Chuyển ObjectId thành string để tra cứu trong object `onlineUsers`
            const recipientSocketId = onlineUsers[recipientId.toString()];

            if (recipientSocketId) {
              // Nếu người dùng này online, gửi sự kiện 'getNotification'
              console.log(`Sending notification to ${recipientId}`);
              io.to(recipientSocketId).emit("getNotification", {
                sender: messageToSend.senderId,
                conversationId: conversationId,
                content: content,
                createdAt: savedMessage.createdAt,
              });
            }
          });
        } catch (error) {
          console.error("Error handling message:", error);
        }
      }
    );

    // Trong file socket.js
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", onlineUsers);
    });
  });
};
