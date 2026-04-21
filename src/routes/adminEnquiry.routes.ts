import { Router } from "express";
import {
  getAllEnquiriesAdmin,
  deleteEnquiry,
  updateEnquiryStatus,
} from "../controllers/adminEnquiry.controller";

const router = Router();

/* GET ALL ENQUIRIES */
router.get("/", getAllEnquiriesAdmin);

/* UPDATE ENQUIRY STATUS */
router.patch("/:id/status", updateEnquiryStatus);

/* DELETE ENQUIRY */
router.delete("/:id", deleteEnquiry);

export default router;
