import { Request, Response } from "express";
import pool from "../config/db";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
          id, 
          title, 
          slug,
          image
       FROM categories
       WHERE is_active = true
       ORDER BY sort_order ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};