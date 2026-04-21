import { Router } from "express";
import { getServiceDetail } from "../controllers/serviceDetail.controller";

const router = Router();

router.get("/:slug", getServiceDetail);

export default router;
