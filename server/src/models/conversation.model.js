import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],

    lastMessage: {
      content: { type: String },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", ConversationSchema);
