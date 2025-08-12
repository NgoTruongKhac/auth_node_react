import api from "./axios.config";

export const fetchCurrentUser = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

export const getUsersByEmail = async (email: string) => {
  const response = await api.get(`/user/search/${email}`);
  return response.data;
};

export const updateProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  await api.post("/user/update-profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
