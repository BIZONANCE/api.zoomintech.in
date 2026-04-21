import { Router } from "express";
import client from "../config/db";

const router = Router();

router.get("/health", async (_req, res) => {
  const result = await client.query("SELECT NOW()");
  res.json({
    status: "ok",
    time: result.rows[0]
  });
});

export default router;
