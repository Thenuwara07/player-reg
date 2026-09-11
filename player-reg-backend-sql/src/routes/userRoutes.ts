import express from "express";
import { regRequest, clubchangeRequest, updateUserAndPlayer, defaultDetails } from "../controllers/userControllers";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/regrequest", authenticateToken, authorizeRoles("player"), regRequest);
router.post("/clubchange", authenticateToken, authorizeRoles("player"), clubchangeRequest);
router.put("/updateuserandplayer", authenticateToken, authorizeRoles("player"), updateUserAndPlayer);
router.get("/defaultdetails", defaultDetails);


export default router;
