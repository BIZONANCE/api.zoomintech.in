import { Request, Response } from "express";
import pool from "../config/db";
import slugify from "slugify";

/* =========================================================
   CREATE SERVICE (Exactly 5 Images Required)
========================================================= */
export const createService = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const {
      title,
      short_description,
      long_description,
      category_id,
      price,          // ✅ NEW
    } = req.body;

    if (!title || !category_id) {
      return res.status(400).json({
        success: false,
        message: "Title & category required",
      });
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const galleryFiles = files?.gallery || [];

    if (galleryFiles.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Exactly 5 images are required",
      });
    }

    await client.query("BEGIN");

    const slug = slugify(title, { lower: true, strict: true });

    const serviceResult = await client.query(
      `
      INSERT INTO services
        (title, slug, short_description, long_description, category_id, price, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *
      `,
      [
        title,
        slug,
        short_description || null,
        long_description || null,
        category_id,
        price ? parseFloat(price) : null,   // ✅ NEW
      ]
    );

    const service = serviceResult.rows[0];

    for (let i = 0; i < 5; i++) {
      const file = galleryFiles[i];

      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      await client.query(
        `
        INSERT INTO service_images (service_id, image_url, sort_order)
        VALUES ($1, $2, $3)
        `,
        [service.id, base64Image, i + 1]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      data: service,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("createService error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  } finally {
    client.release();
  }
};

/* =========================================================
   GET ALL SERVICES (ADMIN)
   Returns first image + price for card
========================================================= */
export const getAllServicesAdmin = async (_: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.title,
        s.slug,
        s.short_description,
        s.long_description,
        s.category_id,
        s.price,                         -- ✅ NEW
        s.is_active,
        s.created_at,
        c.title AS category,
        (
          SELECT si.image_url
          FROM service_images si
          WHERE si.service_id = s.id
          ORDER BY si.sort_order ASC
          LIMIT 1
        ) AS image_url
      FROM services s
      JOIN categories c ON c.id = s.category_id
      ORDER BY s.created_at DESC
    `);

    return res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("getAllServicesAdmin error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

/* =========================================================
   GET SERVICE DETAIL (PUBLIC)
   Returns 5 ordered images + price
========================================================= */
export const getServiceDetail = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const serviceResult = await pool.query(
      `
      SELECT
        s.id,
        s.title,
        s.slug,
        s.short_description,
        s.long_description,
        s.category_id,
        s.price,                         -- ✅ NEW
        s.is_active,
        c.title AS category,
        c.slug AS category_slug
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

    return res.json({
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

/* =========================================================
   GET SERVICE BY ID (FOR ADMIN EDIT FORM)
   s.* already includes price once column is added
========================================================= */
export const getServiceByIdAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const serviceResult = await pool.query(
      `
      SELECT s.*, c.title AS category_name
      FROM services s
      LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.id = $1
      `,
      [id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const service = serviceResult.rows[0];

    const imagesResult = await pool.query(
      `
      SELECT id, image_url, sort_order
      FROM service_images
      WHERE service_id = $1
      ORDER BY sort_order ASC
      `,
      [id]
    );

    service.images = imagesResult.rows;

    return res.json({
      success: true,
      data: service,
    });

  } catch (error) {
    console.error("getServiceByIdAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service details",
    });
  }
};

/* =========================================================
   UPDATE SERVICE
========================================================= */
export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    const {
      title,
      short_description,
      long_description,
      category_id,
      price,          // ✅ NEW
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const galleryFiles = files?.gallery || [];

    await client.query("BEGIN");

    /* ===============================
       1️⃣ UPDATE TEXT FIELDS + PRICE
    =============================== */
    const slug = title
      ? slugify(title, { lower: true, strict: true })
      : null;

    const updateResult = await client.query(
      `
      UPDATE services
      SET
        title             = COALESCE($1, title),
        slug              = COALESCE($2, slug),
        short_description = COALESCE($3, short_description),
        long_description  = COALESCE($4, long_description),
        category_id       = COALESCE($5, category_id),
        price             = $6                        -- ✅ NEW (allows setting NULL)
      WHERE id = $7
      RETURNING *
      `,
      [
        title || null,
        slug,
        short_description || null,
        long_description || null,
        category_id || null,
        price !== undefined && price !== "" ? parseFloat(price) : null,  // ✅ NEW
        id,
      ]
    );

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    /* ===============================
       2️⃣ UPDATE ONLY PROVIDED IMAGES
    =============================== */
    if (galleryFiles.length > 0) {
      const positions = req.body.positions;

      const existingImages = await client.query(
        `
        SELECT id
        FROM service_images
        WHERE service_id = $1
        ORDER BY sort_order ASC
        `,
        [id]
      );

      const existing = existingImages.rows;

      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const position = parseInt(
          Array.isArray(positions) ? positions[i] : positions
        );

        if (!existing[position]) continue;

        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;

        await client.query(
          `
          UPDATE service_images
          SET image_url = $1
          WHERE id = $2
          `,
          [base64Image, existing[position].id]
        );
      }
    }

    /* ===============================
       3️⃣ UPDATE IMAGE ORDER
    =============================== */
    const orderIds = req.body["order_ids[]"] || req.body.order_ids;

    if (orderIds) {
      const idsArray = Array.isArray(orderIds) ? orderIds : [orderIds];

      for (let i = 0; i < idsArray.length; i++) {
        await client.query(
          `
          UPDATE service_images
          SET sort_order = $1
          WHERE id = $2
          `,
          [i + 1, idsArray[i]]
        );
      }
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: updateResult.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("updateService error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  } finally {
    client.release();
  }
};

/* =========================================================
   TOGGLE SERVICE VISIBILITY
========================================================= */
export const toggleServiceVisibility = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE services
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING is_active
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.json({
      success: true,
      is_active: result.rows[0].is_active,
    });

  } catch (error) {
    console.error("toggleServiceVisibility error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service visibility",
    });
  }
};

/* =========================================================
   DELETE SERVICE
========================================================= */
export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM service_images WHERE service_id = $1`,
      [id]
    );

    await pool.query(
      `DELETE FROM services WHERE id = $1`,
      [id]
    );

    return res.json({
      success: true,
      message: "Service deleted successfully",
    });

  } catch (error) {
    console.error("deleteService error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};