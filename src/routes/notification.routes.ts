import { Router } from "express";
import {
  getNotifications,
  markNotificationsSeen,
} from "../controllers/notification.controller";

const router = Router();

/* ================================
   GET NOTIFICATION COUNTS
   GET /api/admin/notifications
================================ */
router.get("/", getNotifications);

/* ================================
   MARK AS SEEN
   PATCH /api/admin/notifications/:type
   type = reviews | enquiries | support
================================ */
router.patch("/:type", markNotificationsSeen);

export default router;
