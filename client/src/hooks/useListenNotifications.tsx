import { useEffect } from "react";
import { useNotificationStore } from "../store/useNotification";
import { socket } from "../socket/socket";
export const useListenNotifications = () => {
  const { notifications, setNotifications } = useNotificationStore();

  useEffect(() => {
    // Bắt đầu lắng nghe sự kiện
    socket?.on("getNotification", (newNotification) => {
      setNotifications([...notifications, newNotification]);
    });

    return () => {
      socket?.off("getNotification");
    };
  }, [notifications, setNotifications, socket]);
};
