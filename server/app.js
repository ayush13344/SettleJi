import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";

dotenv.config();

const app = express();

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://settle-ji.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests like Postman or server-to-server (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ---------------- Middlewares ---------------- */

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

/* ---------------- API Routes ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/settlements", settlementRoutes);

/* ---------------- Home Route ---------------- */

app.get("/", (req, res) => {
  res.send("API Running");
});

/* ---------------- 404 Route ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;