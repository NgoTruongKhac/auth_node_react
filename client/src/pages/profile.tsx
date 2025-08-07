import { Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { updateProfilePicture } from "../apis/user.api";
import { useState, useEffect, type ChangeEvent } from "react";
import blank_avatar from "../assets/images/blank_avatar.png";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  // State to handle loading feedback during upload
  const [isUploading, setIsUploading] = useState(false);
  // State for displaying errors
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo state ban đầu là chuỗi rỗng
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return; // No file selected
    }

    // Basic file validation
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      setError("File is too large. Maximum size is 2MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setError("Invalid file type. Please select a JPG, PNG, or GIF.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Call the function from the store to upload the file
      await updateProfilePicture(file);
      fetchCurrentUser(); // Refresh user data after upload
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
    } finally {
      // Reset loading state regardless of outcome
      setIsUploading(false);
      // Clear the file input value
      event.target.value = "";
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-300 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title text-2xl">Your Profile</h2>

          {/* Avatar and Upload Button */}
          <div className="avatar relative my-4">
            <div className="w-28 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              {isUploading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              ) : (
                <img
                  src={user?.profilePicture || blank_avatar}
                  alt="User profile"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            {/* Nút Upload được đặt chồng lên avatar */}
            <label
              htmlFor="avatar-upload"
              className="btn btn-primary btn-circle btn-sm absolute bottom-0 right-0 cursor-pointer"
            >
              <Camera className="text-base-100" size={16} />
            </label>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          {/* Form Fields */}
          <div className="w-full space-y-4">
            {/* Username Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-error text-sm mb-4">{error}</div>}

          {/* Action Button */}
          <div className="card-actions mt-6 w-full">
            <button className="btn btn-primary w-full">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
