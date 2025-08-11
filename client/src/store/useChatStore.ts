// src/store/useConversationStore.ts

import { create } from "zustand";

// Định nghĩa lại kiểu dữ liệu để khớp với dữ liệu từ API
interface Conversation {
  _id: string;
  participants: [
    {
      _id: string;
      username: string;
      profilePicture: string;
    }
  ];
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: Date;
  };
}

interface ChatStore {
  selectedConversation: Conversation | null; // Thay vì string, hãy lưu cả object
  setSelectedConversation: (conversation: Conversation | null) => void;
  messages: any[]; // Thêm state để lưu messages
  setMessages: (messages: any[]) => void; // Thêm action để cập nhật messages
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));
