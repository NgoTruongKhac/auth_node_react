import ErrorHandler from "../middlewares/errors/ErrorHandler.js";
import { User } from "../models/user.model.js";
import { SERVER_DOMAIN } from "../configs/env.js";
import fs from "fs";
import path from "path";

export const getMe = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new ErrorHandler("not found user", 401);
    }

    return res.status(200).json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ErrorHandler("file not found", 400);
    }

    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      // Nếu không tìm thấy user, xoá file vừa upload để tránh rác
      fs.unlinkSync(req.file.path);
      throw new ErrorHandler("user not found", 404);
    }

    // 1. Lưu lại đường dẫn ảnh cũ (nếu có)
    const oldProfilePicture = user.profilePicture;

    // 2. Cập nhật đường dẫn ảnh mới vào database
    user.profilePicture = `${SERVER_DOMAIN}/uploads/profilePicture/${req.file.filename}`;
    await user.save();

    // 3. Xóa ảnh cũ sau khi đã cập nhật thành công
    if (oldProfilePicture) {
      // Trích xuất tên file từ URL cũ
      // Ví dụ: "http://localhost:8080/uploads/profilePicture/123-abc.jpg" -> "123-abc.jpg"
      const oldFilename = oldProfilePicture.split("/").pop();
      const oldFilePath = path.join("uploads", "profilePicture", oldFilename);

      // Dùng fs.unlink để xóa file.
      // Thêm kiểm tra file tồn tại để tránh lỗi nếu file đã bị xóa thủ công
      if (fs.existsSync(oldFilePath)) {
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Failed to delete old profile picture:", err);
            // Không cần throw lỗi ở đây vì việc chính là upload đã thành công
          }
        });
      }
    }

    return res.status(200).json({
      message: "upload profile picture is successful",
    });
  } catch (error) {
    // Nếu có bất kỳ lỗi nào xảy ra trong quá trình xử lý (ví dụ: save db thất bại),
    // hãy xóa file vừa được multer tải lên để không tạo ra file rác.
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(
            "Error deleting uploaded file after failed update:",
            err
          );
        }
      });
    }
    next(error);
  }
};
