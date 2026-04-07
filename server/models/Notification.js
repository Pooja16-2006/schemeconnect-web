const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
