import { Router } from "express";
import multer from "multer";
import {
  createService,
  getAllServicesAdmin,
  getServiceByIdAdmin,
  deleteService,
  updateService,
  toggleServiceVisibility,
  
} from "../controllers/adminService.controller";

const router = Router();

/* =========================================================
   MULTER CONFIG (Base64 + Vercel Safe)
========================================================= */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Increased to 5MB for safety
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
    } else {
      cb(null, true);
    }
  },
});

/* =========================================================
   ROUTES (FIXED FOR GALLERY)
========================================================= */

// ✅ CREATE SERVICE (Main + Gallery)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  createService
);

// ✅ GET ALL SERVICES (ADMIN LIST)
router.get("/", getAllServicesAdmin);

// 2. Get a SINGLE service by ID (to populate the Edit Form)
// This is the missing link that fetches the 5 images
router.get("/:id", getServiceByIdAdmin);

// ✅ UPDATE SERVICE (Main optional + Replace Gallery)
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  updateService
);


// ✅ TOGGLE VISIBILITY
router.patch("/:id/toggle", toggleServiceVisibility);

// ✅ DELETE SERVICE (Deletes gallery too)
router.delete("/:id", deleteService);

export default router;
