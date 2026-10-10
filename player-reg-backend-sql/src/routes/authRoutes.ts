import express from "express";
import { signIn, signUp, getAllPlayers, getUser, getPlayerDetails, signOut } from "../controllers/authControllers";
import { authenticateToken, authorizeRoles, optionalAuth } from "../middleware/authMiddleware";
import { authLimiter } from "../middleware/rateLimit";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", authLimiter, signIn);
router.post("/logout", authenticateToken, signOut);
// Full player list incl. sensitive fields — admin only.
router.get("/players", authenticateToken, authorizeRoles("admin"), getAllPlayers);
// Public profile for everyone; full record for the player themselves or an admin
router.get("/:userid", optionalAuth, getPlayerDetails);

export default router;
