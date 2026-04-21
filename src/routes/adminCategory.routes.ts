import { Router } from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  reorderCategories,
} from "../controllers/adminCategory.controller";

const router = Router();

router.get("/", getCategories);
router.post("/", createCategory);

// 🔥 IMPORTANT: put reorder BEFORE :id
router.put("/reorder", reorderCategories);

router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;