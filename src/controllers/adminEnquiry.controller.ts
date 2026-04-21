import { Request, Response } from "express";
import pool from "../config/db";

/* =============================
   GET ALL ENQUIRIES (ADMIN)
============================= */
export const getAllEnquiriesAdmin = async (_: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        customer_name,
        email,
        mobile_number,
        product_slug,
        message,
        status,
        created_at
      FROM enquiries
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Admin enquiries error:", error);
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
};

/* =============================
   UPDATE ENQUIRY STATUS
============================= */
export const updateEnquiryStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "contacted", "not_interested"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE enquiries
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({
      success: true,
      enquiry: result.rows[0],
    });
  } catch (error) {
    console.error("Update enquiry status error:", error);
    res.status(500).json({ message: "Failed to update enquiry status" });
  }
};

/* =============================
   DELETE ENQUIRY
============================= */
export const deleteEnquiry = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM enquiries WHERE id = $1`,
      [id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Delete enquiry error:", error);
    res.status(500).json({ message: "Failed to delete enquiry" });
  }
};
