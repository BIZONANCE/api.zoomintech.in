import { Router } from "express";
import { getHero } from "../controllers/hero.controller";

const router = Router();

/* =========================
   HERO ROUTES
========================= */

// GET HERO SECTION
router.get("/", getHero);

export default router;