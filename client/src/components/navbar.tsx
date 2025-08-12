import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import blank_avatar from "../assets/images/blank_avatar.png";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../store/useNotification";
import { useListenNotifications } from "../hooks/useListenNotifications";
import { useEffect } from "react";
import {
  getNotifications,
  setNotificationRead,
} from "../apis/notification.api";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { notifications, setNotifications } = useNotificationStore();

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
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
                  <Bell className="text-2xl text-gray-500 cursor-pointer"></Bell>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  {notifications.map((notification) => (
                    <li key={notification._id}>
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
                  ))}
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
