import { Request, Response } from "express";
import pool from "../config/db";

/* =========================================================
   GET SERVICES BY CATEGORY SLUG
   GET /api/services?categorySlug=loan-services
========================================================= */
export const getServicesByCategory = async (
  req: Request,
  res: Response
) => {
  const { categorySlug } = req.query;

  if (!categorySlug || typeof categorySlug !== "string") {
    return res.status(400).json({
      success: false,
      message: "categorySlug is required",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        s.id,
        s.title,
        s.slug,
        (
          SELECT si.image_url
          FROM service_images si
          WHERE si.service_id = s.id
          ORDER BY si.sort_order ASC
          LIMIT 1
        ) AS image_url
      FROM services s
      JOIN categories c ON c.id = s.category_id
      WHERE c.slug = $1
        AND s.is_active = true
      ORDER BY s.created_at DESC
      `,
      [categorySlug]
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("getServicesByCategory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

/* =========================================================
   GET SINGLE SERVICE DETAIL
   Returns 5 Ordered Images
   GET /api/services/:slug
========================================================= */
export const getServiceDetail = async (
  req: Request,
  res: Response
) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({
      success: false,
      message: "Service slug is required",
    });
  }

  try {
    const serviceResult = await pool.query(
      `
      SELECT
        s.id,
        s.title,
        s.slug,
        s.short_description,
        s.long_description,
        s.price,                        -- ✅ NEW
        c.title AS category,
        c.slug  AS category_slug
      FROM services s
      JOIN categories c ON c.id = s.category_id
      WHERE s.slug = $1
        AND s.is_active = true
      LIMIT 1
      `,
      [slug]
    );

    if (!serviceResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const service = serviceResult.rows[0];

    const imagesResult = await pool.query(
      `
      SELECT image_url, sort_order
      FROM service_images
      WHERE service_id = $1
      ORDER BY sort_order ASC
      `,
      [service.id]
    );

    service.images = imagesResult.rows;

    return res.status(200).json({
      success: true,
      data: service,
    });

  } catch (error) {
    console.error("getServiceDetail error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};