import { Request, Response } from "express";
import pool from "../config/db";

/**
 * POST: Create customer support query
 */
export const createCustomerSupport = async (
  req: Request,
  res: Response
) => {
  const { name, mobile, email, address, query } = req.body;

  if (!name || !mobile || !query) {
    return res.status(400).json({
      message: "Name, mobile and query are required",
    });
  }

  try {
    await pool.query(
      `
      INSERT INTO customer_support
      (name, mobile, email, address, query)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, mobile, email || null, address || null, query]
    );

    res.status(201).json({ message: "Query submitted successfully" });
  } catch (error) {
    console.error("Customer support error:", error);
    res.status(500).json({ message: "Failed to submit query" });
  }
};
