import { Router } from "express";
import {
  getAllSupportAdmin,
  deleteSupport,
  updateSupportStatus,
} from "../controllers/adminSupport.controller";

const router = Router();

router.get("/", getAllSupportAdmin);
router.patch("/:id/status", updateSupportStatus);
router.delete("/:id", deleteSupport);

export default router;
