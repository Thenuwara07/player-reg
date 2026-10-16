import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();

const app = express();

// ✅ Security headers (also removes "X-Powered-By: Express").
// The API is called cross-origin by the frontend, so allow cross-origin reads.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// ✅ Gzip responses (the full players list is ~1 MB per 1,000 players)
app.use(compression());

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://slbfregistration.net",
  "https://player-reg.vercel.app",
  "https://playerregistration-five.vercel.app",
  "https://www.slbfregistration.net",
  // Extra origins without a code change: CORS_ORIGINS="https://a.com,https://b.com"
  ...(process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
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
        console.warn("❌ CORS blocked:", origin);
        // 403 (not 500): a refused origin is not a server error
        return callback(Object.assign(new Error("Not allowed by CORS"), { status: 403 }));
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
app.use("/api/payhere", paymentRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Welcome to the Players Registration API");
});

// ✅ JSON error handler — without this, any error passed to next(err)
// (e.g. from multer/CORS) falls through to Express's default HTML error
// page, which breaks every frontend caller expecting response.json().
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    const status = err?.status || err?.statusCode || 500;
    if (status >= 500) console.error("Unhandled error:", err);
    if (res.headersSent) return;
    res.status(status).json({
      success: false,
      // Client errors (bad JSON, CORS) explain themselves; server errors
      // stay generic so internals never reach the browser
      message: status < 500 ? err?.message || "Bad request" : "Internal server error",
    });
  }
);

export default app;