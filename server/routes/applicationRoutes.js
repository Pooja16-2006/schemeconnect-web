const express = require("express");
const {
  createApplication,
  getApplicationById,
  getApplications,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:applicationId", getApplicationById);

module.exports = router;
