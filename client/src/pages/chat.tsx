// src/pages/chat.tsx
import ChatSideBar from "../components/chatSideBar";
import ChatContainer from "../components/chatContainer";
import { useChatStore } from "../store/useConversationStore";
import NoSelectConversation from "../components/noSelectConversation";

export default function Chat() {
  const { selectedConversation } = useChatStore(); // Cập nhật ở đây
  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      <ChatSideBar />
      {selectedConversation ? <ChatContainer /> : <NoSelectConversation />}
    </div>
  );
}
