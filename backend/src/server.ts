import cors from "cors";
import express from "express";
import { pool } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);

// Tes apakah server berjalan
app.get("/", (_req, res) => {
  res.json({
    message: "KantekMu API berjalan",
  });
});

// Tes koneksi ke PostgreSQL
app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");

    res.json({
      message: "Database terhubung",
      serverTime: result.rows[0].server_time,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Gagal terhubung ke database",
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`KantekMu API berjalan di port ${port}`);
});
