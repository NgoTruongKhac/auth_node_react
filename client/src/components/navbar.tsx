import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import blank_avatar from "../assets/images/blank_avatar.png";
import { Bell } from "lucide-react";
import { Palette } from "lucide-react";
import { useNotificationStore } from "../store/useNotification";
import { useListenNotifications } from "../hooks/useListenNotifications";
import { useEffect } from "react";
import logo from "../assets/images/logo.png";
import {
  getNotifications,
  setNotificationRead,
} from "../apis/notification.api";
import { themes } from "../constants/themes";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const setTheme = useThemeStore((state) => state.setTheme);
  const themeNow = useThemeStore((s) => s.theme);
  console.log("themeNow:", themeNow);

  const { notifications, setNotifications } = useNotificationStore();
  const setSelectedConversation = useChatStore(
    (state) => state.setSelectedConversation
  );

  const fetchNotifications = async () => {
    const fetchedNotifications = await getNotifications();
    setNotifications(fetchedNotifications);
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  console.log("Notifications:", notifications);

  useListenNotifications();

  const notificationsNotRead = notifications.filter((n) => !n.isRead);
  console.log("Notifications not read:", notificationsNotRead);

  const handleNotificationClick = async () => {
    try {
      await setNotificationRead();
      fetchNotifications();
    } catch (error) {
      console.error("Error setting notification as read:", error);
    }
  };

  const handleToConversation = (notification: any) => {
    const conversation = notification.conversationId;

    setSelectedConversation(conversation);

    navigate("/chat");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn-ghost text-xl">
          <img src={logo} alt="logo" className="w-12" />
        </a>
      </div>
      <div className="flex gap-2">
        {!user ? (
          // Hiện login/register buttons nếu chưa đăng nhập
          <div className="flex gap-x-4">
            <Link to={"/login"} className="btn btn-outline btn-primary">
              Login
            </Link>
            <Link to={"/register"} className="btn btn-outline btn-primary">
              Register
            </Link>
          </div>
        ) : (
          // Hiện user avatar nếu đã đăng nhập
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button">
                <Palette className="cursor-pointer" />
              </div>
              <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow">
                {themes.map((theme, key) => (
                  <li key={key}>
                    <button
                      onClick={() => {
                        console.log("clicked", theme); // Bây giờ sẽ hoạt động!
                        setTheme(theme);
                      }}
                      className="flex justify-baseline"
                    >
                      <div
                        data-theme={theme}
                        className="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm"
                      >
                        <div className="bg-base-content size-1.5 rounded-full"></div>{" "}
                        <div className="bg-primary size-1.5 rounded-full"></div>{" "}
                        <div className="bg-secondary size-1.5 rounded-full"></div>{" "}
                        <div className="bg-accent size-1.5 rounded-full"></div>
                      </div>
                      <span className="text-sm">{theme}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="indicator">
              {notificationsNotRead.length > 0 && (
                <span className="indicator-item badge badge-primary">
                  {notificationsNotRead.length}
                </span>
              )}

              <div
                className="dropdown dropdown-end"
                onClick={handleNotificationClick}
              >
                <div tabIndex={0} role="button">
                  <Bell className="text-2xl cursor-pointer"></Bell>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  {notifications.length === 0 ? (
                    <li>
                      <span className="text-gray-500">No notifications</span>
                    </li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification._id}
                        onClick={() => handleToConversation(notification)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img
                                src={
                                  notification.sender.profilePicture ||
                                  blank_avatar
                                }
                                alt={`Avatar of ${notification.sender.username}`}
                              />
                            </div>
                          </div>
                          <span>{` send message: ${notification.content}`}</span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={user.profilePicture || blank_avatar}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to={"/profile"}>Profile ({user.username})</Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
