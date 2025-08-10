import { getConversations } from "../apis/conversation.api";
import { useEffect, useState } from "react";
import blank_avatar from "../assets/images/blank_avatar.png";
import { useChatStore } from "../store/useConversationStore";

type Conversation = {
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
};

export default function ChatSideBar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  // đổi tên `setConversation` thành `setSelectedConversation` cho rõ nghĩa
  const { setSelectedConversation, selectedConversation } = useChatStore();

  console.log(conversations);

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

  return (
    // w-1/3 hoặc w-1/4 để xác định chiều rộng, ở đây dùng w-96 cho cố định
    <div className="flex flex-col w-90 border-r border-base-300 bg-base-200">
      {/* Thanh tìm kiếm */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full"
        />
      </div>

      {/* Dải phân cách */}
      <div className="divider m-0"></div>

      {/* Danh sách cuộc trò chuyện */}
      {/* overflow-y-auto để có thể cuộn khi danh sách dài */}
      <div className="flex-1 overflow-y-auto">
        <ul className="menu p-2">
          {conversations.map((conversation) => (
            <li
              key={conversation._id}
              className={`rounded-lg mb-1 ${
                selectedConversation?._id === conversation._id
                  ? "bg-base-300"
                  : ""
              }`}
            >
              <button
                className="flex items-center gap-4"
                onClick={() => setSelectedConversation(conversation)}
              >
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
                <div className="flex flex-col flex-1">
                  <span className="font-bold">
                    {conversation.participants[0].username}
                  </span>
                  <span className={`text-sm opacity-70`}>
                    {conversation.lastMessage.content}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
