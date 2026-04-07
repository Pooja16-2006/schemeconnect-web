const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  benefit: { type: String },
  eligibility: { type: String },
  state: { type: String, default: "All India" },
}, { timestamps: true });

module.exports = mongoose.models.Scheme || mongoose.model("Scheme", schemeSchema);
