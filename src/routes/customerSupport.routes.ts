import { Router } from "express";
import { createCustomerSupport } from "../controllers/customerSupport.controller";

const router = Router();

router.post("/", createCustomerSupport);

export default router;
