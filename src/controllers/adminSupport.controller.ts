import { Request, Response } from "express";
import pool from "../config/db";

/* ================================
   GET ALL CUSTOMER SUPPORT QUERIES
================================ */
export const getAllSupportAdmin = async (
  _: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        mobile,
        email,
        address,
        query,
        status,
        created_at
      FROM customer_support
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("getAllSupportAdmin error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch support data" });
  }
};

/* ================================
   UPDATE SUPPORT STATUS
================================ */
export const updateSupportStatus = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "resolved"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status value" });
  }

  try {
    await pool.query(
      `UPDATE customer_support
       SET status = $1
       WHERE id = $2`,
      [status, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("updateSupportStatus error:", error);
    res
      .status(500)
      .json({ message: "Failed to update support status" });
  }
};

/* ================================
   DELETE CUSTOMER SUPPORT QUERY
================================ */
export const deleteSupport = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM customer_support WHERE id = $1`,
      [id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("deleteSupport error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete support query" });
  }
};
