const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.Mixed, required: true },
    citizenName: { type: String, trim: true },
    schemeId: { type: String, required: true },
    schemeName: { type: String, required: true },
    ministry: { type: String },
    state: { type: String },
    documentsPending: { type: [String], default: [] },
    nextAction: { type: String, default: "Awaiting review by the department." },
    eta: { type: String, default: "5-7 working days" },
    status: {
      type: String,
      enum: ["approved", "pending", "under-review", "rejected", "processing"],
      default: "pending",
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    fraudScore: { type: Number, default: 0 },
    fraudStatus: { type: String, default: "Clean" },
    fraudFlags: { type: [String], default: [] },
    manualReviewRequired: { type: Boolean, default: false },
    applicationId: { type: String, required: true, unique: true },
    steps: {
      type: [
        {
          id: String,
          title: String,
          description: String,
          status: String,
          date: String,
          remarks: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Application || mongoose.model("Application", applicationSchema);
