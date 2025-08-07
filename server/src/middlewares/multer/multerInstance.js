import multer from "multer";
import fs from "fs";

export const multerInstance = (uploadDir, allowedTypes) => {
  const fullUploadDir = `uploads/${uploadDir}`;

  if (!fs.existsSync(fullUploadDir)) {
    fs.mkdirSync(fullUploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, fullUploadDir);
    },
    filename: (_req, file, cb) => {
      const fileNameOrigin = file.originalname;
      const uniqueFileName =
        Date.now() + "-" + crypto.randomUUID() + fileNameOrigin;
      cb(null, uniqueFileName);
    },
  });

  const fileFilter = (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép file ảnh (jpg, jpeg, png)"), false);
    }
  };

  return multer({
    storage,
    fileFilter,
  });
};
