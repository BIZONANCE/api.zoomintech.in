import { Request, Response } from "express";
import pool from "../config/db";

/* =========================================================
   BLOG CARDS – PUBLIC (Base64 Ready)
========================================================= */
export const getAllBlogs = async (_: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        image,          -- Base64 string
        slug,
        created_at
      FROM blogs
      WHERE slug IS NOT NULL
        AND is_published = true
      ORDER BY created_at DESC
    `);

    return res.status(200).json(result.rows);

  } catch (error) {
    console.error("getAllBlogs error:", error);
    return res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
};


/* =========================================================
   BLOG DETAIL – PUBLIC (Base64 Ready)
========================================================= */
export const getBlogBySlug = async (
  req: Request,
  res: Response
) => {
  const { slug } = req.params;

  try {
    if (!slug) {
      return res.status(400).json({
        message: "Slug is required",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        title,
        content,
        cover_image,   -- Base64 string
        created_at
      FROM blogs
      WHERE slug = $1
        AND is_published = true
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("getBlogBySlug error:", error);
    return res.status(500).json({
      message: "Failed to fetch blog",
    });
  }
};
