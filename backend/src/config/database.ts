import "dotenv/config";
import pg from "pg";

console.log("DATABASE_URL terbaca:", Boolean(process.env.DATABASE_URL));

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
