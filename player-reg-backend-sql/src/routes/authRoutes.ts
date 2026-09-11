import express from "express";
import { signIn, signUp, getAllPlayers, getUser, getPlayerDetails } from "../controllers/authControllers";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/players", getAllPlayers);
router.get("/:userid", getPlayerDetails);

export default router;
