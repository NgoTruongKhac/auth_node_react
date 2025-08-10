import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:3000";

export let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
    socket?.emit("addUser", userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
