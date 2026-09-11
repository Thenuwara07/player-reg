import { Router } from "express";
import { createPost, getAllPosts, updatePost, deletePost, getPostCount } from "../controllers/postController";

const router = Router();
router.post("/post", createPost);
router.get("/posts", getAllPosts);
router.patch("/post/:id", updatePost); // or PUT if you prefer
router.delete("/post/:id", deletePost);
router.get("/posts/count", getPostCount);

export default router;
