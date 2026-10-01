import express from "express";
import { getPendingPlayers, updatetableField, getPendingReg, getClubchangePendingReq, updatePlayerRegDates, getAllCloseclubs, getAllOpenclubs, getAllMercclubs, getAllSchools, getAllUniversities, getAllAssociations, getOpenClubsByAssociationId, getAssociationById, getClubById, updatetableFields, signUpAdmin, getAlladmin, getNotRegisteredPlayerCount, getAllPlayers, getApprovedClubchangesByUser, updateDetails } from "../controllers/adminControllers";
import { getActivityLogs } from "../controllers/logController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/pendingplayers", authenticateToken, authorizeRoles("admin"), getPendingPlayers);
router.put("/updatefield", authenticateToken, authorizeRoles("admin"), updatetableField);
router.put("/updatefields", authenticateToken, authorizeRoles("admin"), updatetableFields);
router.get("/pendingreg", authenticateToken, authorizeRoles("admin"), getPendingReg);
router.get("/clubchangereq", authenticateToken, authorizeRoles("admin"), getClubchangePendingReq);
router.put("/updatereg", authenticateToken, authorizeRoles("admin"), updatePlayerRegDates);
router.get("/allcloseclubs", getAllCloseclubs);
router.get("/allopenclubs", getAllOpenclubs);
router.get("/allmercclubs", getAllMercclubs);
router.get("/allschools", getAllSchools);
router.get("/alluniversities", getAllUniversities);
router.get("/allassociations", getAllAssociations);
router.get("/associations/:associationId/openclubs", getOpenClubsByAssociationId);
router.get("/getassdetails/:type/:associationId",getAssociationById);
router.get("/getclubdetails/:type/:associationId/:clubId",getClubById);
router.post("/signupadmin", authenticateToken, authorizeRoles("admin"), signUpAdmin);
router.get("/alladmins", authenticateToken, authorizeRoles("admin"), getAlladmin);
router.get("/notregisteredplayercount", authenticateToken, authorizeRoles("admin"), getNotRegisteredPlayerCount);
router.get("/allplayers",  getAllPlayers);
router.get("/clubchanges/:userId", getApprovedClubchangesByUser);
// router.get("/getassclubdetails/:associationId",getCloseAssociationById);
router.put("/details", authenticateToken, authorizeRoles("admin"), updateDetails);
router.get("/logs", authenticateToken, authorizeRoles("admin"), getActivityLogs);



export default router;
