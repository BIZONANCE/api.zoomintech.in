import { Request, Response } from "express";
import pool from "../config/db";

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      mobileNumber,
      email,
      productSlug,
      message,
    } = req.body;

    if (!customerName || !mobileNumber) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    await pool.query(
      `
      INSERT INTO enquiries
      (customer_name, mobile_number, email, product_slug, message)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        customerName,
        mobileNumber,
        email || null,
        productSlug || null,
        message || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
    });

  } catch (error: any) {
    console.error("Create Enquiry Error:", error);

    res.status(500).json({
      message: "Failed to submit enquiry",
      error: error.message,
    });
  }
};