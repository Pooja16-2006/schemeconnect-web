const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err);
    });

    await seedAdmin();
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    const User = require("../models/User");
    const existing = await User.findOne({ email: "admin@schemeconnect.com" });
    if (!existing) {
      const hashed = await bcrypt.hash("Admin@123", 10);
      await User.create({
        name: "Admin",
        email: "admin@schemeconnect.com",
        password: hashed,
        role: "admin",
      });
      console.log("Admin user seeded");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Seeding failed:", err.message);
  }
};

module.exports = connectDB;
