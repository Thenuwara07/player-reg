import express from "express";
import { signIn, signUp, getAllPlayers, getUser, getPlayerDetails, signOut } from "../controllers/authControllers";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { authLimiter } from "../middleware/rateLimit";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", authLimiter, signIn);
router.post("/logout", authenticateToken, signOut);
// Full player list incl. sensitive fields — admin only.
router.get("/players", authenticateToken, authorizeRoles("admin"), getAllPlayers);
router.get("/:userid", getPlayerDetails);

export default router;
