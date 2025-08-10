import api from "./axios.config";

export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/message/${conversationId}`);
  return response.data;
};
