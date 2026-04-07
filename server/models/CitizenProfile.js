const mongoose = require("mongoose");

const citizenProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    annual_income: { type: Number, required: true },
    caste: { type: String, required: true },
    state: { type: String, required: true },
    occupation: { type: String, required: true },
    family_size: { type: Number, default: 1 },
    land_owned: { type: Number, default: 0 },
    has_bank_account: { type: Boolean, default: true },
    latestEligibleCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.models.CitizenProfile || mongoose.model("CitizenProfile", citizenProfileSchema);
