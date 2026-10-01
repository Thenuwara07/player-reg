import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

// Only PNG, JPEG and PDF uploads are accepted (no HEIC, WebP, etc.)
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "application/pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: process.env.CLOUDINARY_FOLDER || "player-reg/uploads",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  }),
});

export const uploadCloudinary = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPEG or PDF files are allowed"));
    }
  },
});

// Turns upload errors (bad type, too large, Cloudinary rejection) into a
// JSON 400 the frontend can show, instead of Express's default HTML 500.
export const handleUploadErrors =
  (middleware: (req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err?: unknown) => {
      if (!err) return next();
      const message =
        err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "File is too large (max 8MB)"
          : err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Upload failed";
      res.status(400).json({ success: false, message });
    });
  };
