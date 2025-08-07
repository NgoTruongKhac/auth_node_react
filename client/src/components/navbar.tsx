import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import blank_avatar from "../assets/images/blank_avatar.png";
export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

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
        )}
      </div>
    </div>
  );
}
