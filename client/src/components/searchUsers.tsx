import { useState } from "react";
import { getUsersByEmail } from "../apis/user.api";
import blank_avatar from "../assets/images/blank_avatar.png";

// Định nghĩa kiểu dữ liệu User (có thể chuyển vào file types chung)
type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
};

// Định nghĩa props cho component
interface SearchUsersProps {
  // Một hàm callback sẽ được gọi khi người dùng nhấn "Chat"
  onStartChat: (user: User) => void;
}

export default function SearchUsers({ onStartChat }: SearchUsersProps) {
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm xử lý khi submit form tìm kiếm
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const results = await getUsersByEmail(email);
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to search users:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi chọn một người dùng để chat
  const handleSelectUser = (user: User) => {
    onStartChat(user); // Gọi hàm callback từ component cha
    // Dọn dẹp state của component này
    setSearchResults([]);
    setEmail("");
  };

  return (
    <>
      {/* Form tìm kiếm */}
      <form onSubmit={handleSearchSubmit} className="p-4 flex gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng bằng email..."
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : "Tìm"}
        </button>
      </form>

      {/* Danh sách kết quả tìm kiếm */}
      {searchResults.length > 0 && (
        <ul className="menu p-2">
          <p className="p-2 text-xs uppercase text-base-content/50">
            Kết quả tìm kiếm
          </p>
          {searchResults.map((user) => (
            <li key={user._id} className="rounded-lg mb-1">
              <div className="flex items-center justify-between w-full">
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
                    <span className="text-sm opacity-70">{user.email}</span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSelectUser(user)}
                >
                  Chat
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
