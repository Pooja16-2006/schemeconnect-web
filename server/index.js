require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { seedDemoAdmin, seedSampleData } = require("./config/memoryStore");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const schemeRoutes = require("./routes/schemeRoutes");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Security headers
app.use(helmet());

// Rate limiting
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

// Connect DB and seed demo data in non‑production
connectDB().then(async () => {
  if (!isProduction) {
    await seedSampleData();
    await seedDemoAdmin();
  }
});

app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

// ✅ FIXED: Single health check endpoint with DB status
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  let status;
  switch (dbState) {
    case 0:
      status = "disconnected";
      break;
    case 1:
      status = "connected";
      break;
    case 2:
      status = "connecting";
      break;
    case 3:
      status = "disconnecting";
      break;
    default:
      status = "unknown";
  }

  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: status,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is operational",
    timestamp: new Date().toISOString()
  });
});

// Root info route
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "SchemeConnect Express API",
    version: "1.0.0",
    endpoints: [
      "/health",
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

// Routes
app.use("/api", schemeRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/applications", applicationRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ✅ Correct port binding for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});