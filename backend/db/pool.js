import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: dotenv.env.DB_USERNAME,
  host: dotenv.env.DB_HOST,
  database: dotenv.env.DB_NAME,
  password: dotenv.env.DB_PASSWORD,
  port: dotenv.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

export default pool;
