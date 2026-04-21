import { Request, Response } from "express";
import pool from "../config/db";

/* ================================
   GET ALL NOTIFICATION COUNTS
================================ */
export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const [reviews, enquiries, support] = await Promise.all([
      pool.query(
        "SELECT COUNT(*) FROM reviews WHERE is_seen = false"
      ),
      pool.query(
        "SELECT COUNT(*) FROM enquiries WHERE is_seen = false"
      ),
      pool.query(
        "SELECT COUNT(*) FROM customer_support WHERE is_seen = false"
      ),
    ]);

    const data = {
      reviews: Number(reviews.rows[0].count),
      enquiries: Number(enquiries.rows[0].count),
      support: Number(support.rows[0].count),
    };

    return res.json({
      ...data,
      total: data.reviews + data.enquiries + data.support,
    });
  } catch (error) {
    console.error("❌ Notification count error:", error);
    return res
      .status(500)
      .json({ message: "Failed to load notifications" });
  }
};

/* ================================
   MARK NOTIFICATIONS AS SEEN
   type = reviews | enquiries | support
================================ */
export const markNotificationsSeen = async (
  req: Request,
  res: Response
) => {
  const type = req.params.type as
    | "reviews"
    | "enquiries"
    | "support";

  const tableMap = {
    reviews: "reviews",
    enquiries: "enquiries",
    support: "customer_support",
  } as const;

  const table = tableMap[type];

  if (!table) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    await pool.query(
      `UPDATE ${table} SET is_seen = true WHERE is_seen = false`
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Mark seen error:", error);
    return res
      .status(500)
      .json({ message: "Failed to update notifications" });
  }
};
