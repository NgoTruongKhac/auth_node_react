// src/components/chatContainer.tsx

import { useChatStore } from "../store/useConversationStore";
import { useEffect, useState, FormEvent, useRef } from "react";
import { getMessages } from "../apis/message.api";
import { useAuthStore } from "../store/useAuthStore";
import blank_avatar from "../assets/images/blank_avatar.png";
import { socket } from "../socket/socket"; // Import socket
import useListenMessages from "../hooks/useListenMessages"; // Import hook

// ... type message

export default function ChatContainer() {
  // Lấy state và action từ store
  const { selectedConversation, messages, setMessages } = useChatStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const previousConversationId = useRef<string | null>(null); // Dùng để lưu conversationId cũ

  useListenMessages();

  useEffect(() => {
    // Rời khỏi phòng cũ trước khi tham gia phòng mới
    if (previousConversationId.current) {
      socket?.emit("leaveConversation", previousConversationId.current); // (Optional but good practice)
    }

    const fetchMessagesAndJoinRoom = async () => {
      if (selectedConversation) {
        // Tham gia phòng mới
        socket?.emit("joinConversation", selectedConversation._id);
        previousConversationId.current = selectedConversation._id;

        try {
          const data = await getMessages(selectedConversation._id);
          setMessages(data.reverse());
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setMessages([]);
        }
      }
    };

    fetchMessagesAndJoinRoom();

    // Cleanup khi component unmount
    return () => {
      if (selectedConversation) {
        socket?.emit("leaveConversation", selectedConversation._id);
      }
    };
  }, [selectedConversation, setMessages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user || !selectedConversation) return;

    // Không cần receiverId nữa
    socket?.emit("sendMessage", {
      senderId: user.userId,
      conversationId: selectedConversation._id,
      content: content.trim(),
    });

    setContent("");
  };

  // Lấy thông tin người đối thoại để hiển thị
  const otherUser = selectedConversation?.participants.find(
    (p) => p._id !== user?.userId
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Header của vùng chat */}
      <div className="flex items-center gap-4 p-4 border-b border-base-300 bg-base-200">
        <div className="avatar online">
          <div className="w-10 rounded-full">
            <img
              src={otherUser?.profilePicture || blank_avatar}
              alt={`Avatar of ${otherUser?.username}`}
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold">{otherUser?.username}</h2>
        </div>
      </div>

      {/* Khu vực hiển thị tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {messages.map((msg) => {
          // Lưu ý: senderId có thể là object hoặc string tùy vào dữ liệu
          const senderId =
            typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
          const isOwnMessage = senderId === user?.userId;
          const senderInfo = isOwnMessage ? user : otherUser;
          return (
            <div
              key={msg._id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Avatar"
                    src={senderInfo?.profilePicture || blank_avatar}
                  />
                </div>
              </div>
              <div className="chat-header">
                {isOwnMessage ? "You" : senderInfo?.username}
                <time className="text-xs opacity-50 ml-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  isOwnMessage ? "chat-bubble-primary" : ""
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Khu vực nhập tin nhắn */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-base-300 bg-base-200"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Send
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L11.25 9.25l-7.5-3.333-1.414 4.95a.75.75 0 00.95.826l4.949-1.414a.75.75 0 000-1.404l-4.95-1.413zM12.395 8.289a.75.75 0 00-.95-.826L4.25 9.25l7.5 3.333 1.414-4.95a.75.75 0 00-.826-.95l-4.949 1.414a.75.75 0 000 1.404l4.95 1.413z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
