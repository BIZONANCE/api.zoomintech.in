import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Optional: test connection once (not required, but useful)
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log("✅ Neon PostgreSQL connected (POOLING)");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};

export default pool;
