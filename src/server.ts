import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5005;

// 1. Connect to DB immediately (Serverless friendly)
connectDB();

// 2. Only listen if NOT in production (Vercel sets NODE_ENV to 'production' by default)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// 3. Export the app for Vercel to use
export default app;