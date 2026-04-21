import { Request, Response } from "express";
import pool from "../config/db";

/* =========================
   GET CONTACT DETAILS
========================= */
export const getContactDetails = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_details LIMIT 1"
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contact details" });
  }
};

export const updateContactDetails = async (req: Request, res: Response) => {
  try {
    const {
      address,
      phone1,
      phone2,
      email,
      business_hours,
      facebook_url,
      instagram_url,
      google_url,
      map_embed_url,
      status, // ✅ ADDED
    } = req.body;

    // Check if row exists
    const existing = await pool.query(
      "SELECT id FROM contact_details WHERE id = 1"
    );

    if (existing.rows.length === 0) {
      // INSERT if not exists
      await pool.query(
        `
        INSERT INTO contact_details 
        (id, address, phone1, phone2, email, business_hours, facebook_url, instagram_url, google_url, map_embed_url, status)
        VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `,
        [
          address,
          phone1,
          phone2,
          email,
          business_hours,
          facebook_url,
          instagram_url,
          google_url,
          map_embed_url,
          status || "working", // ✅ default fallback
        ]
      );
    } else {
      // UPDATE if exists
      await pool.query(
        `
        UPDATE contact_details
        SET address=$1,
            phone1=$2,
            phone2=$3,
            email=$4,
            business_hours=$5,
            facebook_url=$6,
            instagram_url=$7,
            google_url=$8,
            map_embed_url=$9,
            status=$10,
            updated_at=NOW()
        WHERE id=1
        `,
        [
          address,
          phone1,
          phone2,
          email,
          business_hours,
          facebook_url,
          instagram_url,
          google_url,
          map_embed_url,
          status || "working", // ✅ default fallback
        ]
      );
    }

    res.json({ message: "Contact details saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save contact details" });
  }
};