import express from "express";
import cors from "cors";
import path from "path";

/* =========================
   ROUTE IMPORTS
========================= */
import categoryRoutes from "./routes/category.routes";
import serviceRoutes from "./routes/service.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import reviewRoutes from "./routes/review.routes";
import customerSupportRoutes from "./routes/customerSupport.routes";
import contactRoutes from "./routes/contact.routes";
import blogRoutes from "./routes/blog.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import heroRoutes from "./routes/hero.routes";

import adminServiceRoutes from "./routes/adminService.routes";
import adminCategoryRoutes from "./routes/adminCategory.routes";
import adminReviewRoutes from "./routes/adminReview.routes";
import adminEnquiryRoutes from "./routes/adminEnquiry.routes";
import adminSupportRoutes from "./routes/adminSupport.routes";
import adminBlogRoutes from "./routes/adminBlog.routes";
import notificationRoutes from "./routes/notification.routes";
import adminAuthRoutes from "./routes/adminAuth.routes";
import adminHeroRoutes from "./routes/adminHero.routes";

/* =========================
   APP INITIALIZATION
========================= */
const app = express();

/* =========================
   MIDDLEWARE
========================= */
/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",  // your dashboard port
  ],
  credentials: true,
}));

// 🔥 IMPORTANT FOR BASE64 IMAGES
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* =========================
   STATIC FILE SERVING
   This makes uploaded images visible
   http://localhost:5000/uploads/filename.jpg
========================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* =========================
   PUBLIC ROUTES
========================= */
app.use("/api", categoryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/customer-support", customerSupportRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hero", heroRoutes);
/* =========================
   ADMIN ROUTES
========================= */
app.use("/api/admin/services", adminServiceRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin/enquiries", adminEnquiryRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/admin/support", adminSupportRoutes);
app.use("/api/admin/notifications", notificationRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/hero", adminHeroRoutes);
/* =========================
   DEFAULT ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
