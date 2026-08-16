// src/middleware/upload.js
import multer from 'multer'

const storage = multer.memoryStorage();

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      return cb(new Error("Invalid video format. Allowed: mp4, webm, mov"));
    }
  } else if (["thumbnail", "banner"].includes(file.fieldname)) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error("Invalid image format. Allowed: jpeg, png, webp"));
    }
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
});

