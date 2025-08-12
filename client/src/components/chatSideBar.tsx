import { getConversations } from "../apis/conversation.api";
import { memo, useEffect, useState } from "react";
import blank_avatar from "../assets/images/blank_avatar.png";
import { useChatStore } from "../store/useChatStore";
import SearchUsers from "./searchUsers";
// Các kiểu dữ liệu này nên được đặt trong một file chung (ví dụ: src/types/index.ts)
type Conversation = {
  _id?: string;
  isNew?: boolean;
  participants: [
    {
      _id: string;
      username: string;
      profilePicture: string;
    }
  ];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: Date;
  };
};

type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
};

function ChatSideBar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const setSelectedConversation = useChatStore(
    (state) => state.setSelectedConversation
  );
  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  // 2. Hàm này được giữ lại để truyền xuống cho SearchUsers
  const handleStartChat = (userToChat: User) => {
    const existingConversation = conversations.find((c) =>
      c.participants.some((p) => p._id === userToChat._id)
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      const tempConversation: Conversation = {
        isNew: true,
        participants: [
          {
            _id: userToChat._id,
            username: userToChat.username,
            profilePicture: userToChat.profilePicture,
          },
        ],
      };
      setSelectedConversation(tempConversation);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  // Cập nhật danh sách conversations khi có cuộc trò chuyện mới được tạo
  useEffect(() => {
    if (
      selectedConversation?._id &&
      !conversations.some((c) => c._id === selectedConversation._id)
    ) {
      setConversations((prev) => [
        selectedConversation as Conversation,
        ...prev,
      ]);
    }
  }, [selectedConversation]);

  console.log("Conversations:", conversations);

  return (
    <div className="flex flex-col w-96 border-r border-base-300 bg-base-200">
      {/* 3. Sử dụng component SearchUsers và truyền hàm xử lý vào */}
      <SearchUsers onStartChat={handleStartChat} />

      {/* Dải phân cách */}
      <div className="divider m-0"></div>

      {/* Danh sách cuộc trò chuyện */}
      <div className="flex-1 overflow-y-auto">
        <ul className="menu p-2">
          {conversations.map((conversation) => (
            <li
              // Dùng key dự phòng cho các cuộc trò chuyện mới chưa có _id
              key={conversation._id || conversation.participants[0]._id}
              className={`rounded-lg mb-1 cursor-pointer ${
                selectedConversation?.participants[0]._id ===
                conversation.participants[0]._id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-base-300"
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center gap-4 p-2">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src={
                        conversation.participants[0].profilePicture ||
                        blank_avatar
                      }
                      alt={`Avatar of ${conversation.participants[0].username}`}
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1 text-left overflow-hidden">
                  <span className="font-bold">
                    {conversation.participants[0].username}
                  </span>
                  {/* Chỉ hiển thị tin nhắn cuối nếu có */}
                  {conversation.lastMessage && (
                    <span className="text-sm opacity-70 truncate">
                      {conversation.lastMessage.content}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default memo(ChatSideBar);
