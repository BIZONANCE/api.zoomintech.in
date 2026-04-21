import { Router } from "express";
import {
  getAllBlogs,
  getBlogBySlug,
} from "../controllers/blog.controller";

const router = Router();

/* ================================
   PUBLIC BLOG ROUTES
================================ */

// GET /api/blogs
router.get("/", getAllBlogs);

// GET /api/blogs/:slug
router.get("/:slug", getBlogBySlug);

export default router;
