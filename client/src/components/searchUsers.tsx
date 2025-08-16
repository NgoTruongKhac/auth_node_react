import { useState, useEffect } from "react"; // Thêm useEffect
import { getUsersByEmail } from "../apis/user.api";
import blank_avatar from "../assets/images/blank_avatar.png";

// Định nghĩa kiểu dữ liệu User
type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
};

// Định nghĩa props cho component
interface SearchUsersProps {
  onStartChat: (user: User) => void;
}

export default function SearchUsers({ onStartChat }: SearchUsersProps) {
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // State để quản lý hiển thị dropdown

  // Sử dụng useEffect để thực hiện tìm kiếm với cơ chế debounce
  useEffect(() => {
    // Nếu không có email, dọn dẹp kết quả và ẩn dropdown
    if (!email.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true); // Hiển thị dropdown ngay khi bắt đầu gõ
    setLoading(true);

    // Đặt một timer. API chỉ được gọi sau khi người dùng ngưng gõ 500ms
    const debounceTimer = setTimeout(async () => {
      try {
        const results = await getUsersByEmail(email);
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to search users:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); // Thời gian chờ là 500ms

    // Hàm dọn dẹp: Hủy timer trước đó nếu người dùng tiếp tục gõ
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [email]); // Dependency array: Effect này sẽ chạy lại mỗi khi 'email' thay đổi

  // Hàm xử lý khi chọn một người dùng để chat
  const handleSelectUser = (user: User) => {
    onStartChat(user);
    setSearchResults([]);
    setEmail("");
    setShowDropdown(false);
  };

  return (
    // Thêm một div cha với position relative để định vị dropdown
    <div className="relative p-4">
      <label className="input flex items-center gap-2">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          required
          placeholder="Search by email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 150);
          }}
          onFocus={() => {
            // Hiển thị lại dropdown khi focus vào input (nếu có email)
            if (email.trim()) {
              setShowDropdown(true);
            }
          }}
        />
      </label>

      {/* Dropdown kết quả tìm kiếm */}
      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 p-2 shadow-lg bg-base-100 rounded-sm z-10 w-full max-h-80 overflow-y-auto border">
          {loading ? (
            <li className="p-4 text-center">
              <span className="loading loading-spinner loading-md"></span>
            </li>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="rounded-lg mb-1 border w-[250px] hover:bg-gray-300"
                  // Dùng onMouseDown thay vì onClick để không bị onBlur của input làm ẩn dropdown trước khi click kịp thực thi
                  onMouseDown={() => handleSelectUser(user)}
                >
                  <div className="flex items-center justify-between w-full cursor-pointer p-2">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img
                            src={user.profilePicture || blank_avatar}
                            alt={`Avatar of ${user.username}`}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{user.username}</span>
                        <span className="text-sm opacity-70 truncate max-w-[180px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    {/* Nút chat có thể không cần thiết nếu click vào cả item là đã chọn */}
                  </div>
                </li>
              ))}
            </>
          ) : (
            <li className="p-4 text-center text-sm text-base-content/60">
              No users found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
