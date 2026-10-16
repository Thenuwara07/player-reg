import express from "express";
import { payHereNotify } from "../controllers/paymentController";

const router = express.Router();

// Called server-to-server by PayHere (form-encoded). Public on purpose:
// every notification is verified with the merchant-secret signature.
router.post("/notify", express.urlencoded({ extended: false }), payHereNotify);

export default router;
