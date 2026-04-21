import { Router } from "express";
import {
  getAllReviewsAdmin,
  deleteReview,
  toggleHideReview,
  createReviewAdmin,
} from "../controllers/adminReview.controller";

const router = Router();

router.get("/", getAllReviewsAdmin);
router.post("/", createReviewAdmin);        // ✅ FIXED
router.patch("/:id/hide", toggleHideReview);
router.delete("/:id", deleteReview);

export default router;