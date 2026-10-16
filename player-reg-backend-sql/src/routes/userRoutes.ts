import express from "express";
import { regRequest, clubchangeRequest, updateUserAndPlayer, defaultDetails } from "../controllers/userControllers";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { startPayHereCheckout, getPayHereStatus } from "../controllers/paymentController";

const router = express.Router();

router.post("/regrequest", authenticateToken, authorizeRoles("player"), regRequest);
router.post("/clubchange", authenticateToken, authorizeRoles("player"), clubchangeRequest);
router.put("/updateuserandplayer", authenticateToken, authorizeRoles("player"), updateUserAndPlayer);
router.get("/defaultdetails", defaultDetails);
// Online registration payment (PayHere)
router.post("/payhere/checkout", authenticateToken, authorizeRoles("player"), startPayHereCheckout);
router.get("/payhere/status/:orderId", authenticateToken, authorizeRoles("player"), getPayHereStatus);


export default router;
