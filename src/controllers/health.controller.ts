import { Request, Response } from "express";
import pool from "../config/db";

export const healthCheck = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ status: "db_error" });
  }
};
