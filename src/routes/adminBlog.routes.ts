import { Router } from "express";
import {
  getAllBlogsAdmin,
  createBlog,
  deleteBlog,
  toggleBlogVisibility,
  updateBlog,
  getBlogByIdAdmin,
} from "../controllers/adminBlog.controller";

const router = Router();

/* ================================
   ADMIN BLOG ROUTES
================================ */

// GET ALL BLOGS (published + hidden)
// GET /api/admin/blogs
router.get("/", getAllBlogsAdmin);

// CREATE BLOG
// POST /api/admin/blogs
router.post("/", createBlog);

// TOGGLE VISIBILITY
// PATCH /api/admin/blogs/:id/toggle
router.patch("/:id/toggle", toggleBlogVisibility);

// DELETE BLOG
// DELETE /api/admin/blogs/:id
router.delete("/:id", deleteBlog);

// GET BLOG BY ID
// GET /api/admin/blogs/:id
router.get("/:id", getBlogByIdAdmin);

// UPDATE BLOG
// PUT /api/admin/blogs/:id
router.put("/:id", updateBlog);

export default router;
