// src/hooks/useListenMessages.ts

import { useEffect } from "react";
import { socket } from "../socket/socket";
import { useChatStore } from "../store/useChatStore";

const useListenMessages = () => {
  const { messages, setMessages } = useChatStore();

  useEffect(() => {
    // Backend của bạn emit sự kiện 'getMessage'
    socket?.on("getMessage", (newMessage) => {
      // Thêm tin nhắn mới vào danh sách messages hiện tại
      setMessages([...messages, newMessage]);
    });

    // Rất quan trọng: Phải dọn dẹp listener khi component unmount
    // để tránh bị lắng nghe nhiều lần và gây memory leak.
    return () => {
      socket?.off("getMessage");
    };
  }, [socket, messages, setMessages]); // Dependencies để chạy lại effect khi cần
};

export default useListenMessages;
