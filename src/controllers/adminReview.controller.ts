import { Request, Response } from "express";
import pool from "../config/db";

/* ==================================================
   GET ALL REVIEWS (ADMIN – includes hidden ones)
================================================== */
export const getAllReviewsAdmin = async (_: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        mobile,
        review,
        rating,
        created_at,
        is_hidden
      FROM reviews
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("getAllReviewsAdmin error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


/* ==================================================
   HIDE / UNHIDE REVIEW
================================================== */
export const toggleHideReview = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Review ID is required" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE reviews
      SET is_hidden = NOT is_hidden
      WHERE id = $1
      RETURNING id, is_hidden
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      reviewId: result.rows[0].id,
      is_hidden: result.rows[0].is_hidden,
    });
  } catch (error) {
    console.error("toggleHideReview error:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};


/* ==================================================
   DELETE REVIEW
================================================== */
export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Review ID is required" });
  }

  try {
    const result = await pool.query(
      `
      DELETE FROM reviews 
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviewId: result.rows[0].id,
    });
  } catch (error) {
    console.error("deleteReview error:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
}; 
/* ==================================================
   CREATE REVIEW (ADMIN)
================================================== */
export const createReviewAdmin = async (req: Request, res: Response) => {
  const { name, review, rating } = req.body;

  if (!name || !review || !rating) {
    return res.status(400).json({
      message: "Name, review and rating are required",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO reviews (name, mobile, review, rating, is_hidden)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        name,
        mobile,
        review,
        rating,
        created_at,
        is_hidden
      `,
      [
        name,
        null,              // ✅ mobile removed completely
        review,
        rating,
        false,             // ✅ always published by default
      ]
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("createReviewAdmin error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};