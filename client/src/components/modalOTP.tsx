import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useShowModalStore } from "../store/useShowModalStore";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { verifyOtp } from "../apis/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import Cookies from "js-cookie";

// Định nghĩa props của ModalOTP

export default function ModalOTP() {
  const setShowModal = useShowModalStore((state) => state.setShowModal);
  const showModal = useShowModalStore((state) => state.showModal);

  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [countDown, setCountDown] = useState(120);

  useEffect(() => {
    // Điều kiện chạy: modal đang mở VÀ thời gian vẫn còn
    if (showModal && countDown > 0) {
      const timerId = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);

      // Dọn dẹp interval khi effect chạy lại hoặc component unmount
      return () => clearInterval(timerId);
    } else if (countDown <= 0) {
      setError("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
    }
  }, [showModal, countDown]);

  // 2. Hàm định dạng thời gian (giây -> "phút:giây")
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển focus sang ô tiếp theo khi nhập
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Tự động chuyển focus về ô trước đó khi nhấn Backspace
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --- Hàm xử lý việc dán OTP mới ---
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault(); // Ngăn chặn hành vi dán mặc định

    // Lấy dữ liệu từ clipboard, lọc và lấy 6 ký tự đầu tiên
    const pastedData = event.clipboardData.getData("text/plain").slice(0, 6);
    const pastedOtp = pastedData.split("");

    if (pastedOtp.length > 0) {
      const newOtp = ["", "", "", "", "", ""];
      pastedOtp.forEach((char, i) => {
        if (i < 6) {
          newOtp[i] = char;
        }
      });
      setOtp(newOtp);

      // Tự động chuyển focus đến ô cuối cùng
      if (pastedOtp.length < 6) {
        inputRefs.current[pastedOtp.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };
  // ------------------------------------

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    try {
      const otpCode = otp.join("");
      const { accessToken, refreshToken } = await verifyOtp(otpCode);
      Cookies.set("access_token", accessToken, { expires: 7 });
      Cookies.set("refresh_token", refreshToken, { expires: 30 });

      setShowModal(false);

      fetchCurrentUser();

      navigate("/");

      console.log("register success");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data) {
        setError(axiosError.response.data.message);
      }

      console.log(error);
    }
  };

  return (
    <div className="modal-box">
      <form method="dialog">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
      </form>
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-lg mb-4">Nhập Mã Xác Thực (OTP)</h3>
        <p className="text-sm text-gray-500 mb-6">
          Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email
        </p>
        {/* --- BẮT ĐẦU THAY ĐỔI --- */}
        <div className="mb-6 text-center">
          {countDown > 0 ? (
            <p className="text-lg font-semibold text-blue-600">
              Mã sẽ hết hạn trong:{" "}
              <span className="font-mono tracking-wider">
                {formatTime(countDown)}
              </span>
            </p>
          ) : (
            <p className="text-red-500 font-semibold">Mã OTP đã hết hạn!</p>
          )}
        </div>
        {/* --- KẾT THÚC THAY ĐỔI --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => handleInputChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-xl mt-1 flex justify-center">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary w-full mt-4">
            Xác nhận
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          Không nhận được mã?{" "}
          <button className="text-blue-500 hover:underline">Gửi lại</button>
        </div>
      </div>
    </div>
  );
}
