// useAuthStore.ts - FIXED VERSION
import { create } from "zustand";
import { fetchCurrentUser } from "../apis/user.api";
import Cookies from "js-cookie";
import { connectSocket, disconnectSocket } from "../socket/socket";

interface User {
  userId: string;
  username: string;
  email: string;
  profilePicture: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  stopLoading: () => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  fetchCurrentUser: async () => {
    try {
      const currentUser = await fetchCurrentUser();
      set({
        user: currentUser,
        isAuthenticated: true,
      });
      if (currentUser?.userId) {
        connectSocket(currentUser.userId);
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    disconnectSocket();
    set({
      user: null,
      isAuthenticated: false,
    });
  },
  isLoading: true,
  stopLoading: () => {
    set({ isLoading: false });
  },
}));
