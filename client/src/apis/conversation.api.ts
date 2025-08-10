import api from "./axios.config";

export const getConversations = async () => {
  const response = await api.get("/conversation");
  return response.data;
};
