import { Request, Response } from "express";
import pool from "../config/db";

export const getHero = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM hero_section LIMIT 1"
    );

    const hero = result.rows[0];

    // FIX: convert images string → array
    if (hero?.images && typeof hero.images === "string") {
      try {
        hero.images = JSON.parse(hero.images);
      } catch {
        hero.images = hero.images.split(",");
      }
    }

    res.json(hero);

  } catch (error) {
    console.error("Hero fetch error:", error);
    res.status(500).json({ message: "Failed to fetch hero" });
  }
};