require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const { seedDemoAdmin, seedSampleData } = require("./config/memoryStore");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const schemeRoutes = require("./routes/schemeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
seedSampleData();
seedDemoAdmin();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];

      const isPrivateLanOrigin = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):3000$/.test(origin);

      if (allowedOrigins.includes(origin) || isPrivateLanOrigin) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin ${origin}`));
    },
    credentials: true,
  }),
);
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

app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
