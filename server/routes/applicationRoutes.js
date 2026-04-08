const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const {
  createApplication,
  getApplicationById,
  getApplications,
  getAllApplicationsAdmin,
  updateApplicationStatusAdmin,
} = require("../controllers/applicationController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();
const uploadsRoot = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const userFolder = String(req.user?.id || "anonymous").replace(/[^a-zA-Z0-9_-]/g, "_");
    const targetDir = path.join(uploadsRoot, userFolder);
    fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const baseName = String(file.fieldname || "document").replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const allowedExtensions = new Set([".pdf", ".jpg", ".jpeg", ".png"]);
    if (allowedExtensions.has(ext)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed."));
  },
});

function maybeUploadDocuments(req, res, next) {
  if (!req.is("multipart/form-data")) {
    next();
    return;
  }

  upload.any()(req, res, next);
}

router.get("/admin/all", adminProtect, getAllApplicationsAdmin);
router.patch("/admin/:applicationId", adminProtect, updateApplicationStatusAdmin);

router.post("/", protect, maybeUploadDocuments, createApplication);
router.get("/", protect, getApplications);
router.get("/:applicationId", protect, getApplicationById);

module.exports = router;
