import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app = express();

// -------------------- CORS --------------------
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:8080",
  "https://player-registration.vercel.app",
]);

const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/curl
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "ngrok-skip-browser-warning",
  ],
  credentials: false,
  optionsSuccessStatus: 204,
});

app.use(corsMiddleware);

// Preflight response (safe, no route patterns)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// -------------------- Body --------------------
app.use(express.json());

// -------------------- Uploads Path --------------------
// ✅ Absolute uploads folder (works in ts-node / dist / nodemon)
const uploadsDir = path.resolve(process.cwd(), "uploads");

// ✅ Serve images normally
app.use("/uploads", express.static(uploadsDir));

// ✅ IMPORTANT: Fix ORB/ngrok warning by proxying images via API
// <img> can't send headers, but fetch can. So use /api/image/<name>
app.get("/api/image/:name", (req, res) => {
  const name = req.params.name;

  // basic safety: prevent "../" path traversal
  if (name.includes("..") || name.includes("/") || name.includes("\\")) {
    return res.status(400).json({ message: "Invalid file name" });
  }

  const filePath = path.join(uploadsDir, name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Image not found" });
  }

  // helps cross-origin image loading in some cases
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  return res.sendFile(filePath);
});

// -------------------- Routes --------------------
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api", uploadRoutes);

// test
app.get("/", (req, res) => {
  res.send("Welcome to the Players Registration API");
});

export default app;
