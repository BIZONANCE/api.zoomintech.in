import { Router } from "express";
import { getHero, updateHero } from "../controllers/adminHero.controller";

const router = Router();

/* ================================
   HERO ROUTES
================================ */

/* Get Hero Section */
router.get("/", getHero);

/* Update Hero Section */
router.put("/", updateHero);

export default router;