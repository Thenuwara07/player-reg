import { Router } from "express";
import { createPost, getAllPosts, updatePost, deletePost, getPostCount } from "../controllers/postController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();
router.post("/post", authenticateToken, authorizeRoles("admin"), createPost);
// Public: the homepage feed reads this without a token.
router.get("/posts", getAllPosts);
router.patch("/post/:id", authenticateToken, authorizeRoles("admin"), updatePost); // or PUT if you prefer
router.delete("/post/:id", authenticateToken, authorizeRoles("admin"), deletePost);
router.get("/posts/count", authenticateToken, authorizeRoles("admin"), getPostCount);

export default router;
