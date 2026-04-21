import { Router } from "express";
import {
  getServicesByCategory,
  getServiceDetail,
} from "../controllers/service.controller";

const router = Router();

/* =========================================================
   PUBLIC SERVICE ROUTES
========================================================= */

// GET /api/services?categorySlug=loan-services
router.get("/", getServicesByCategory);

// GET /api/services/gold-loan
router.get("/:slug", getServiceDetail);

export default router;
