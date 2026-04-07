const express = require("express");
const {
  createApplication,
  getApplicationById,
  getApplications,
  getAllApplicationsAdmin,
  updateApplicationStatusAdmin,
} = require("../controllers/applicationController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin/all", adminProtect, getAllApplicationsAdmin);
router.patch("/admin/:applicationId", adminProtect, updateApplicationStatusAdmin);

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.get("/:applicationId", protect, getApplicationById);

module.exports = router;
