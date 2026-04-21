import { Request, Response } from "express";
import pool from "../config/db";

/* =========================================
   GET HERO
========================================= */
export const getHero = async (_req: Request, res: Response) => {
  try {

    const result = await pool.query(
      "SELECT * FROM hero_section LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hero not found" });
    }

    const hero = result.rows[0];

    /* Convert images JSON → array */
    if (hero.images && typeof hero.images === "string") {
      try {
        hero.images = JSON.parse(hero.images);
      } catch {
        hero.images = [];
      }
    }

    res.json(hero);

  } catch (error) {
    console.error("Hero fetch error:", error);
    res.status(500).json({ message: "Failed to fetch hero" });
  }
};


/* =========================================
   UPDATE HERO
========================================= */
export const updateHero = async (req: Request, res: Response) => {
  try {

    const hero = req.body;

    console.log("Incoming hero data:", hero);

    const images = JSON.stringify(hero.images || []);

    const query = `
      UPDATE hero_section
      SET
        subtitle = $1,
        title_main = $2,
        title_highlight = $3,
        title_line2 = $4,
        description = $5,
        images = $6,
        feature_1_title = $7,
        feature_1_desc = $8,
        feature_2_title = $9,
        feature_2_desc = $10,
        feature_3_title = $11,
        feature_3_desc = $12,
        feature_4_title = $13,
        feature_4_desc = $14
      WHERE id = 1
      RETURNING *
    `;

    const values = [
      hero.subtitle,
      hero.title_main,
      hero.title_highlight,
      hero.title_line2,
      hero.description,
      images,
      hero.feature_1_title,
      hero.feature_1_desc,
      hero.feature_2_title,
      hero.feature_2_desc,
      hero.feature_3_title,
      hero.feature_3_desc,
      hero.feature_4_title,
      hero.feature_4_desc,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hero row not found. Ensure id=1 exists."
      });
    }

    const updatedHero = result.rows[0];

    /* Convert images JSON → array */
    if (updatedHero.images && typeof updatedHero.images === "string") {
      try {
        updatedHero.images = JSON.parse(updatedHero.images);
      } catch {
        updatedHero.images = [];
      }
    }

    console.log("Hero updated successfully:", updatedHero);

    res.json(updatedHero);

  } catch (error) {
    console.error("Hero update error:", error);
    res.status(500).json({ message: "Hero update failed" });
  }
};