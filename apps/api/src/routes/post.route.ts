import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createPost,getPosts,searchPost } from "../controllers/post.controller";
import { votePost } from "../controllers/vote.controller";

const router = Router();

router.post("/create",authMiddleware,createPost);
router.get("/feed",getPosts);
router.get("/search",searchPost);
router.post("/vote",authMiddleware,votePost);

export default router;