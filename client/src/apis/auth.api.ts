import api from "./axios.config";
import Cookies from "js-cookie";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (
  username: string,
  password: string,
  email: string
) => {
  const response = await api.post("/auth/register", {
    username,
    password,
    email,
  });
  return response.data;
};

export const verifyOtp = async (otp: string) => {
  const response = await api.post("/auth/verify-register", { otp });
  return response.data;
};

export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};
export const loginWithGoogle = () => {
  window.open(`${import.meta.env.VITE_SERVER_DOMAIN}/api/v1/auth/google`);
};
