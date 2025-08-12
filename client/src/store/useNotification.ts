import { create } from "zustand";

interface Notification {
  _id: string;
  recipient: {
    username: string;
    profilePicture: string;
  };
  sender: {
    username: string;
    profilePicture: string;
  };
  conversationId: string;
  content: string;
  isRead: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));
