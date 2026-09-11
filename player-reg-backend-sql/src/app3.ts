import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import path from "path";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:8080",
  "https://player-registration.vercel.app",
  "https://player-reg-f-my-sql.vercel.app",
]);

const corsMiddleware = cors({
  origin: (origin, cb) => {
    // Allow Postman/curl (no Origin header)
    if (!origin) return cb(null, true);

    // Exact match for your frontends
    if (allowedOrigins.has(origin)) return cb(null, true);

    // Debugging: Print to console if an origin is rejected
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "ngrok-skip-browser-warning",
  ],
  credentials: false, // set true ONLY if you use cookies
  optionsSuccessStatus: 204,
});

// 1. Apply CORS middleware first
app.use(corsMiddleware);

// 2. Parse JSON bodies
app.use(express.json());

// 3. Define Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", postRoutes);
app.use("/api/user", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the Players Registration API");
});

export default app;