import { Request, Response } from "express";
import pool from "../config/db";

/* ================================
   GET PUBLIC REVIEWS
   (ONLY PUBLISHED)
================================ */
export const getReviews = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        review,
        rating,
        created_at
      FROM reviews
      WHERE is_hidden = false
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("getReviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

/* ================================
   CREATE REVIEW
   (DEFAULT = HIDDEN)
================================ */
export const createReview = async (req: Request, res: Response) => {
  const { name, mobile, review, rating } = req.body;

  if (!name || !mobile || !review || !rating) {
    return res.status(400).json({
      message: "name, mobile, review and rating are required",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO reviews (name, mobile, review, rating, is_hidden)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id, name, mobile, review, rating, created_at, is_hidden
      `,
      [name, mobile, review, rating]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createReview error:", error);
    res.status(500).json({
      message: "Failed to submit review",
    });
  }
};

/* ================================
   ADMIN - GET ALL REVIEWS
================================ */
export const getAllReviewsAdmin = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        mobile,
        review,
        rating,
        is_hidden,
        created_at
      FROM reviews
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("getAllReviewsAdmin error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

