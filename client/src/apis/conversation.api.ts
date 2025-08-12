import api from "./axios.config";

export const getConversations = async () => {
  const response = await api.get("/conversation");
  return response.data;
};

export const createConversation = async (
  recipientId: string,
  content: string
) => {
  const response = await api.post("/conversation", { recipientId, content });
  return response.data;
};
