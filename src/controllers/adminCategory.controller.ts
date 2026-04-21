import { Request, Response } from "express";
import pool from "../config/db";

/* ============================= */
/* GET ALL CATEGORIES */
/* ============================= */
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, title, slug, image, created_at, sort_order
       FROM categories
       ORDER BY sort_order ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("getCategories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ============================= */
/* CREATE CATEGORY */
/* ============================= */
export const createCategory = async (req: Request, res: Response) => {
  const { title, image } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title required" });
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  try {
    const orderResult = await pool.query(
      `SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM categories`
    );

    const nextOrder = orderResult.rows[0].max_order + 1;

    const result = await pool.query(
      `INSERT INTO categories (title, slug, image, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, slug, image || null, nextOrder]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createCategory error:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

/* ============================= */
/* REORDER CATEGORIES */
/* ============================= */
export const reorderCategories = async (req: Request, res: Response) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return res.status(400).json({
      message: "Invalid order data",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (let i = 0; i < orderedIds.length; i++) {
      await client.query(
        `UPDATE categories
         SET sort_order = $1
         WHERE id = $2`,
        [i + 1, orderedIds[i]]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Categories reordered successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("reorderCategories error:", error);
    res.status(500).json({ message: "Failed to reorder categories" });
  } finally {
    client.release();
  }
};

/* ============================= */
/* DELETE CATEGORY */
/* ============================= */
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM categories WHERE id = $1`,
      [id]
    );

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

/* ============================= */
/* UPDATE CATEGORY */
/* ============================= */
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, image } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title required" });
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  try {
    const result = await pool.query(
      `UPDATE categories
       SET title = $1, slug = $2, image = $3
       WHERE id = $4
       RETURNING *`,
      [title, slug, image || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateCategory error:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};