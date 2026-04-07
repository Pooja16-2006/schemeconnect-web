const CitizenProfile = require("../models/CitizenProfile");
const Scheme = require("../models/Scheme");
const Notification = require("../models/Notification");
const { memoryNotifications, memorySchemes } = require("../config/memoryStore");
const { callMlService, getHealth } = require("../services/mlService");

function canUseMongo() {
  return CitizenProfile.db && CitizenProfile.db.readyState === 1;
}

async function healthCheck(req, res) {
  try {
    const mlHealth = await getHealth();
    return res.json({
      success: true,
      service: "SchemeConnect Express API",
      ml: mlHealth,
      mongodb: canUseMongo() ? "connected" : "not_connected",
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: "ML service unavailable",
      error: error.message,
      mongodb: canUseMongo() ? "connected" : "not_connected",
    });
  }
}

async function predictEligibility(req, res) {
  try {
    const profile = req.body;
    const result = await callMlService("/predict-eligibility", profile);

    if (canUseMongo()) {
      await CitizenProfile.create({
        ...profile,
        fullName: req.body.fullName,
        latestEligibleCount: result.eligible_count || 0,
      });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch eligibility from ML service",
      error: error.message,
    });
  }
}

async function recommendSchemes(req, res) {
  try {
    const result = await callMlService("/recommend-schemes", req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch recommendations from ML service",
      error: error.message,
    });
  }
}

async function chat(req, res) {
  try {
    const result = await callMlService("/chat", req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch chat response from ML service",
      error: error.message,
    });
  }
}

async function getSchemeCatalog(req, res) {
  try {
    if (canUseMongo()) {
      const schemes = await Scheme.find({}).lean();
      return res.json({ success: true, schemes, total: schemes.length });
    }
    return res.json({ success: true, schemes: memorySchemes, total: memorySchemes.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch schemes", error: error.message });
  }
}

async function getNotifications(req, res) {
  try {
    const { userId } = req.params;
    if (canUseMongo()) {
      const notifications = await Notification.find({ userId }).lean();
      return res.json({ success: true, notifications, total: notifications.length });
    }
    const notifications = memoryNotifications.filter((item) => item.userId === userId);
    return res.json({ success: true, notifications, total: notifications.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch notifications", error: error.message });
  }
}

module.exports = {
  healthCheck,
  predictEligibility,
  recommendSchemes,
  chat,
  getSchemeCatalog,
  getNotifications,
};
