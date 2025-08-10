import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

const MONGODB_URI = "mongodb://localhost:27017/authentication";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // await User.deleteMany({});
    // await Conversation.deleteMany({});
    // await Message.deleteMany({});
    // console.log("🗑 Dữ liệu cũ đã bị xoá.");

    // // Tạo password đã hash
    // const hashedPassword = await bcrypt.hash("123456", 10);

    // // 1️⃣ Users
    // const users = await User.insertMany([
    //   {
    //     username: "Alice",
    //     email: "alice@example.com",
    //     password: hashedPassword,
    //     googleId: "google-alice",
    //   },
    //   {
    //     username: "Bob",
    //     email: "bob@example.com",
    //     password: hashedPassword,
    //     googleId: "google-bob",
    //   },
    //   {
    //     username: "Charlie",
    //     email: "charlie@example.com",
    //     password: hashedPassword,
    //     googleId: "google-charlie",
    //   },
    //   {
    //     username: "David",
    //     email: "david@example.com",
    //     password: hashedPassword,
    //     googleId: "google-david",
    //   },
    //   {
    //     username: "Eva",
    //     email: "eva@example.com",
    //     password: hashedPassword,
    //     googleId: "google-eva",
    //   },
    // ]);
    // console.log(`👤 Đã tạo ${users.length} user.`);

    // 2️⃣ Conversations
    const conversations = await Conversation.insertMany([
      {
        participants: ["68972c374e8d2f9a64e0d213", "68972c374e8d2f9a64e0d215"],
        lastMessage: {
          content: "Hey Charlie, how are you?",
          senderId: "68972c374e8d2f9a64e0d213",
          createdAt: new Date(),
        },
      },
      {
        participants: ["68972c374e8d2f9a64e0d213", "68972c374e8d2f9a64e0d216"],
        lastMessage: {
          content: "Hi Alice!",
          senderId: "68972c374e8d2f9a64e0d216",
          createdAt: new Date(),
        },
      },
    ]);
    console.log(`💬 Đã tạo ${conversations.length} conversation.`);

    // 3️⃣ Messages
    // const messages = [
    //   {
    //     conversationId: conversations[0]._id,
    //     senderId: users[0]._id,
    //     content: "Hey Bob, how are you?",
    //   },
    //   {
    //     conversationId: conversations[0]._id,
    //     senderId: users[1]._id,
    //     content: "Hi Alice! I'm good, thanks.",
    //   },
    //   {
    //     conversationId: conversations[1]._id,
    //     senderId: users[2]._id,
    //     content: "Hi David!",
    //   },
    //   {
    //     conversationId: conversations[1]._id,
    //     senderId: users[3]._id,
    //     content: "Hello Charlie!",
    //   },
    // ];

    // await Message.insertMany(messages);
    // console.log(`✉ Đã tạo ${messages.length} message.`);

    console.log("✅ Seed dữ liệu thành công!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi seed dữ liệu:", error);
    process.exit(1);
  }
};

seedData();
