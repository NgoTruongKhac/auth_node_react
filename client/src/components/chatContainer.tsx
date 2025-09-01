// src/components/chatContainer.tsx

import { Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createConversation } from "../apis/conversation.api";
import { getMessages } from "../apis/message.api";
import blank_avatar from "../assets/images/blank_avatar.png";
import useListenMessages from "../hooks/useListenMessages"; // Import hook
import { socket } from "../socket/socket"; // Import socket
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import NoSelectConversation from "./noSelectConversation";

// ... type message

export default function ChatContainer() {
  // Lấy state và action từ store
  const {
    selectedConversation,
    messages,
    setMessages,
    setSelectedConversation,
  } = useChatStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState("");

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useListenMessages();

  useEffect(() => {
    const fetchMessages = async () => {
      // SỬA: Chỉ fetch tin nhắn nếu conversation đã có _id
      if (selectedConversation && selectedConversation._id) {
        socket?.emit("joinConversation", selectedConversation._id);
        try {
          const data = await getMessages(selectedConversation._id);
          setMessages(data.reverse());
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setMessages([]);
        }
      } else {
        // Nếu là conversation mới (chưa có _id), thì danh sách tin nhắn rỗng
        setMessages([]);
      }
    };

    fetchMessages();

    return () => {
      if (selectedConversation?._id) {
        socket?.emit("leaveConversation", selectedConversation._id);
      }
    };
  }, [selectedConversation, setMessages]);

  // SỬA: Logic gửi tin nhắn
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user || !selectedConversation) return;

    // Lấy ID của người nhận
    const recipient = selectedConversation.participants.find(
      (p) => p._id !== user.userId
    );
    if (!recipient) return;

    // KIỂM TRA: Đây là tin nhắn đầu tiên hay tin nhắn tiếp theo?
    if (selectedConversation.isNew || !selectedConversation._id) {
      // === Gửi tin nhắn đầu tiên (qua HTTP POST) ===
      try {
        const newConversation = await createConversation(
          recipient._id,
          content.trim()
        );

        // Cập nhật conversation trong store với dữ liệu thật từ server
        setSelectedConversation(newConversation);
        socket?.emit("sendFirstMessage", {
          senderId: user.userId,
          recipientId: recipient._id,
          content: content.trim(),
        });

        setContent("");
      } catch (error) {
        console.error("Failed to create conversation:", error);
      }
    } else {
      // === Gửi các tin nhắn tiếp theo (qua Socket) ===
      socket?.emit("sendMessage", {
        senderId: user.userId,
        conversationId: selectedConversation._id,
        content: content.trim(),
      });
      setContent("");
    }
  };
  // Lấy thông tin người đối thoại để hiển thị
  const otherUser = selectedConversation?.participants.find(
    (p) => p._id !== user?.userId
  );
  if (!selectedConversation) {
    return <NoSelectConversation />;
  }

  return (
    <div className="flex flex-1 flex-col border">
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
                <div className="w-10 rounded-full border">
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
        <div ref={lastMessageRef} />
      </div>

      {/* Khu vực nhập tin nhắn */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-base-300 bg-base-200"
      >
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div>
            <button
              type="submit"
              className="flex items-center bg-transparent cursor-pointer"
            >
              <Send scale={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
