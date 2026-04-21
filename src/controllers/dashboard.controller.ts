import { Request, Response } from "express";
import pool from "../config/db";

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [
      services,
      categories,
      reviews,
      enquiries,
      support,
      blogs,
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM services"),
      pool.query("SELECT COUNT(*) FROM categories"),
      pool.query("SELECT COUNT(*) FROM reviews"),
      pool.query("SELECT COUNT(*) FROM enquiries"),
      pool.query("SELECT COUNT(*) FROM customer_support"),
      pool.query("SELECT COUNT(*) FROM blogs"),
    ]);

    res.json({
      services: Number(services.rows[0].count),
      categories: Number(categories.rows[0].count),
      reviews: Number(reviews.rows[0].count),
      enquiries: Number(enquiries.rows[0].count),
      support: Number(support.rows[0].count),
      blogs: Number(blogs.rows[0].count),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Dashboard stats failed" });
  }
};
