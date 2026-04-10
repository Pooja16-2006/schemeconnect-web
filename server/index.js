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
const chatRoutes = require("./routes/chat");
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
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.FRONTEND_ORIGIN,
      'https://schemeconnectweb.vercel.app',
      'http://localhost:3000',
    ].filter(Boolean);
    
    if (!origin || allowed.some(o => origin.startsWith(o.replace(/\/$/, '')))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// ============================================
// ✅ Root-level health check (no /api prefix)
// ============================================
app.get("/health", (req, res) => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState;
  
  let dbStatus;
  switch (dbState) {
    case 0: dbStatus = "disconnected"; break;
    case 1: dbStatus = "connected"; break;
    case 2: dbStatus = "connecting"; break;
    case 3: dbStatus = "disconnecting"; break;
    default: dbStatus = "unknown";
  }

  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root info route
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "SchemeConnect Express API",
    version: "1.0.0",
    status: "online",
    endpoints: [
      "GET /health - Server health check",
      "GET /api/health - API health check (from schemeRoutes)",
      "POST /api/auth/login - User login",
      "POST /api/auth/register - User registration",
      "GET /api/schemes/catalog - Get all schemes",
      "POST /api/applications - Submit application",
      "GET /api/applications - Get all applications (admin)",
      "POST /api/predict-eligibility - Predict scheme eligibility",
      "POST /api/recommend-schemes - Get scheme recommendations",
      "POST /api/chat - Chat with AI assistant",
      "GET /api/notifications/:userId - Get user notifications"
    ],
  });
});

// ============================================
// ✅ API Routes
// ============================================

// Apply rate limiting to all /api routes
app.use("/api", limiter);

// Auth routes with stricter rate limiting
app.use("/api/auth", authLimiter, authRoutes);

// Chat route
app.use("/api/chat", chatRoutes);

// Application routes
app.use("/api/applications", applicationRoutes);

// Scheme routes (includes /api/health via schemeController)
// This will handle:
// - GET /api/health
// - GET /api/schemes/catalog
// - GET /api/notifications/:userId
// - POST /api/predict-eligibility
// - POST /api/recommend-schemes
// - POST /api/chat
app.use("/api", schemeRoutes);

// ============================================
// Error Handlers (must be last)
// ============================================

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler (must be absolute last)
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SchemeConnect API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
});