import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: "postgres",
  host: "interchange.proxy.rlwy.net",
  database: "railway",
  password: "wUHEGQQWoWsmAYOilaYPmvLLyNQdpAbs",
  port: 46731,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

export default pool;
