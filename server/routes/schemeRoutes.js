const express = require("express");
const {
  chat,
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
router.post("/chat", chat);

module.exports = router;
