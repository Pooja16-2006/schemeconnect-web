require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { seedDemoAdmin, seedSampleData } = require("./config/memoryStore");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const schemeRoutes = require("./routes/schemeRoutes");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Security headers
app.use(helmet());

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." },
});
app.use(cors({ origin: "https://schemeconnectweb.vercel.app" }));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
connectDB().then(async () => {
  if (!isProduction) {
    await seedSampleData();
    await seedDemoAdmin();
  }
});

app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "SchemeConnect Express API",
    version: "1.0.0",
    endpoints: [
      "/api/health",
      "/api/predict-eligibility",
      "/api/recommend-schemes",
      "/api/chat",
      "/api/auth/login",
      "/api/auth/register",
      "/api/applications",
    ],
  });
});

app.use("/api", schemeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});


