// import express from "express";
// import upload from "../middleware/upload";
// import { handleFileUpload } from "../controllers/uploadController";

// const router = express.Router();

// router.post("/upload", upload.single("file"), handleFileUpload);

// export default router;
import { Router } from "express";
import { uploadCloudinary } from "../middleware/uploadCloudinary";
import { uploadImage } from "../controllers/uploadController";

const router = Router();

// field name from frontend must be "image"
router.post("/image", uploadCloudinary.single("image"), uploadImage);

export default router;
