import { Request, Response } from "express";
import pool from "../config/db";

/* ================================
   ADMIN – GET ALL BLOGS
================================ */
export const getAllBlogsAdmin = async (_: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        image,
        slug,
        content,
        cover_image,
        created_at,
        is_published
      FROM blogs
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("getAllBlogsAdmin error:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* ================================
   ADMIN – CREATE BLOG (BASE64 SAFE)
================================ */
export const createBlog = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "No body received" });
    }

    const {
      title,
      description,
      image,
      slug,
      content,
      cover_image,
    } = req.body;

    await pool.query(
      `
      INSERT INTO blogs (
        title,
        description,
        image,
        slug,
        content,
        cover_image
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        title,
        description,
        image || null,        // Base64 string
        slug,
        content,
        cover_image || null,  // Base64 string
      ]
    );

    res.status(201).json({ message: "Blog created successfully" });

  } catch (error) {
    console.error("createBlog error:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

/* ================================
   ADMIN – DELETE BLOG
================================ */
export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM blogs WHERE id = $1`, [id]);

    res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error("deleteBlog error:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

/* ================================
   ADMIN – GET BLOG BY ID
================================ */
export const getBlogByIdAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        image,
        slug,
        content,
        cover_image,
        created_at,
        is_published
      FROM blogs
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("getBlogByIdAdmin error:", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

/* ================================
   ADMIN – UPDATE BLOG (BASE64 SAFE)
================================ */
export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!req.body) {
      return res.status(400).json({ message: "No body received" });
    }

    const {
      title,
      description,
      image,
      slug,
      content,
      cover_image,
    } = req.body;

    await pool.query(
      `
      UPDATE blogs
      SET
        title = $1,
        description = $2,
        image = $3,
        slug = $4,
        content = $5,
        cover_image = $6
      WHERE id = $7
      `,
      [
        title,
        description,
        image || null,        // Base64
        slug,
        content,
        cover_image || null,  // Base64
        id,
      ]
    );

    res.status(200).json({ message: "Blog updated successfully" });

  } catch (error) {
    console.error("updateBlog error:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

/* ================================
   ADMIN – HIDE / UNHIDE BLOG
================================ */
export const toggleBlogVisibility = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(
      `
      UPDATE blogs
      SET is_published = NOT is_published
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({ message: "Blog visibility updated" });

  } catch (error) {
    console.error("toggleBlogVisibility error:", error);
    res.status(500).json({ message: "Failed to update blog visibility" });
  }
};
