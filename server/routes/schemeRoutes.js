const express = require("express");
const {
  getNotifications,
  getSchemeCatalog,
  healthCheck,
  predictEligibility,
  recommendSchemes,
} = require("../controllers/schemeController");

const router = express.Router();

router.get("/health", healthCheck);
router.get("/schemes/catalog", getSchemeCatalog);
router.get("/notifications/:userId", getNotifications);
router.post("/predict-eligibility", predictEligibility);
router.post("/recommend-schemes", recommendSchemes);

module.exports = router;
