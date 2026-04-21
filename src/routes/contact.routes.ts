import { Router } from "express";
import {
  getContactDetails,
  updateContactDetails,
} from "../controllers/contact.controller";

const router = Router();

/* =========================
   CONTACT ROUTES
========================= */

// GET contact details
router.get("/", getContactDetails);

// CREATE or UPDATE contact details
router.put("/", updateContactDetails);

export default router;