import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://playerregistration-five.vercel.app"
];

// ✅ CORS configuration (robust)
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests without origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error("❌ CORS blocked:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
    credentials: true,
  })
);

// ✅ Proper preflight handling (SAFE for latest Express)
app.options(/.*/, cors());

// ✅ Body parser
app.use(express.json());

// ✅ Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", postRoutes);
app.use("/api/user", userRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Welcome to the Players Registration API");
});

export default app;