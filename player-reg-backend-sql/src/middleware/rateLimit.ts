import rateLimit from "express-rate-limit";

// Brute-force mitigation on sign-in. Generous enough that a real user
// mistyping their password a few times is never affected.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

// Abuse/quota mitigation on the public image-upload endpoint (it must stay
// unauthenticated because the sign-up flow uploads ID images before the new
// player has an account). One signup only needs a handful of uploads.
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many uploads. Please try again later.",
  },
});
