import api from "./axios.config";

export const craeateNotification = async (
  recipientId: string,
  senderId: string,
  conversationId: string,
  content: string
) => {
  const response = await api.post("/notification", {
    recipientId,
    senderId,
    conversationId,
    content,
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get("/notification");
  return response.data;
};

export const setNotificationRead = async () => {
  const response = await api.patch(`/notification/`);
  return response.data;
};
