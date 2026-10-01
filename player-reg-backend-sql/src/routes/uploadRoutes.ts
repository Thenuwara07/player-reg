// import express from "express";
// import upload from "../middleware/upload";
// import { handleFileUpload } from "../controllers/uploadController";

// const router = express.Router();

// router.post("/upload", upload.single("file"), handleFileUpload);

// export default router;
import { Router } from "express";
import { uploadCloudinary } from "../middleware/uploadCloudinary";
import { uploadImage } from "../controllers/uploadController";
import { uploadLimiter } from "../middleware/rateLimit";

const router = Router();

// Stays unauthenticated: the sign-up flow uploads ID/profile images before
// the new player has an account/token. Rate-limited instead to curb abuse.
// field name from frontend must be "image"
router.post("/image", uploadLimiter, uploadCloudinary.single("image"), uploadImage);

export default router;
