const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log("MongoDB not configured. Running in-memory only.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected.");
    await seedMongoDB();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

async function seedMongoDB() {
  const User = require("../models/User");
  const Scheme = require("../models/Scheme");
  const Application = require("../models/Application");
  const Notification = require("../models/Notification");
  const bcrypt = require("bcryptjs");
  const {
    sampleSchemes,
    sampleApplications,
    sampleNotifications,
    sampleUsers,
  } = require("./sampleData");

  const adminExists = await User.findOne({ email: "admin@schemeconnect.in" });
  if (!adminExists) {
    const password = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "SchemeConnect Admin",
      email: "admin@schemeconnect.in",
      password,
      role: "admin",
    });
    console.log("Admin seeded.");
  }

  if (!(await Scheme.countDocuments())) {
    await Scheme.insertMany(sampleSchemes);
    console.log("Schemes seeded.");
  }

  if (!(await Application.countDocuments())) {
    await Application.insertMany(sampleApplications);
    console.log("Applications seeded.");
  }

  if (!(await Notification.countDocuments())) {
    await Notification.insertMany(sampleNotifications);
    console.log("Notifications seeded.");
  }

  const citizenCount = await User.countDocuments({ role: "citizen" });
  if (!citizenCount) {
    const password = await bcrypt.hash("citizen123", 10);
    const citizens = sampleUsers.map((u) => ({
      ...u,
      email: `${u.name.toLowerCase().replace(/ /g, ".")}@demo.in`,
      password,
      role: "citizen",
    }));
    await User.insertMany(citizens);
    console.log("Citizens seeded.");
  }
}

module.exports = connectDB;
