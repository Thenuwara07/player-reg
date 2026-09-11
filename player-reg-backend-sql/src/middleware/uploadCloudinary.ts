import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: process.env.CLOUDINARY_FOLDER || "player-reg/uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

export const uploadCloudinary = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});
