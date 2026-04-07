const crypto = require("crypto");
const Application = require("../models/Application");
const { memoryApplications } = require("../config/memoryStore");
const { callMlService } = require("../services/mlService");

function canUseMongo() {
  return Application.db && Application.db.readyState === 1;
}

function buildApplicationId() {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 900 + 100);
  return `SC-${stamp}${random}`;
}

function deriveRiskLevel(score) {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function buildFraudReviewStep(fraudResult) {
  if (!fraudResult.manualReviewRequired) {
    return null;
  }

  return {
    id: "s0",
    title: "Fraud Review Screening",
    description: "Application has been routed for additional verification before department review.",
    status: "current",
    remarks: fraudResult.fraudFlags[0] || "Additional document review is required.",
  };
}

function defaultSteps(status, fraudResult = null) {
  const steps = [
    {
      id: "s1",
      title: "Application Submitted",
      description: "Your application has been received by SchemeConnect.",
      status: "completed",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    },
    {
      id: "s2",
      title: "Document Verification",
      description: "Submitted documents are being validated.",
      status: status === "pending" ? "current" : "pending",
    },
    {
      id: "s3",
      title: "Department Review",
      description: "The scheme department is reviewing your application.",
      status: "pending",
    },
    {
      id: "s4",
      title: "Final Decision",
      description: "Application will be approved or rejected after review.",
      status: "pending",
    },
  ];

  const fraudStep = buildFraudReviewStep(
    fraudResult || { manualReviewRequired: false, fraudFlags: [] },
  );

  return fraudStep ? [steps[0], fraudStep, ...steps.slice(1)] : steps;
}

async function getApplicationCountForUser(userId) {
  if (canUseMongo()) {
    return Application.countDocuments({ userId });
  }

  return memoryApplications.filter((application) => application.userId === userId).length;
}

async function assessFraudRisk({ req, citizenName, state }) {
  const applicationCount = await getApplicationCountForUser(req.user.id);
  const aadhaarHash = crypto
    .createHash("sha256")
    .update(`${req.user.email}:${citizenName}:${state}`)
    .digest("hex");

  try {
    const result = await callMlService("/check-fraud", {
      citizen_id: req.user.id,
      name: citizenName,
      aadhaar_hash: aadhaarHash,
      age: Number(req.body.age || 30),
      state,
      annual_income: Number(req.body.annualIncome || req.body.annual_income || 0),
      application_count: applicationCount + 1,
    });

    const fraudScore = Number(result.fraud_score || 0);
    return {
      fraudScore,
      fraudStatus: result.status || "Clean",
      fraudFlags: result.flags || [],
      manualReviewRequired: Boolean(result.is_flagged),
      riskLevel: deriveRiskLevel(fraudScore),
    };
  } catch (error) {
    const heuristicScore = applicationCount >= 5 ? 45 : 0;
    return {
      fraudScore: heuristicScore,
      fraudStatus: heuristicScore >= 40 ? "Flagged for review" : "Clean",
      fraudFlags: heuristicScore >= 40 ? ["Repeated applications detected from the same profile."] : [],
      manualReviewRequired: heuristicScore >= 40,
      riskLevel: deriveRiskLevel(heuristicScore),
    };
  }
}

async function createApplication(req, res) {
  try {
    const {
      citizenName,
      schemeId,
      schemeName,
      ministry,
      state,
      documentsPending = [],
      nextAction,
      eta,
    } = req.body;

    if (!schemeId || !schemeName) {
      return res.status(400).json({ success: false, message: "Scheme details are required." });
    }

    const resolvedCitizenName = citizenName || req.user.name;
    const resolvedState = state || "National";
    const fraudResult = await assessFraudRisk({
      req,
      citizenName: resolvedCitizenName,
      state: resolvedState,
    });

    const applicationPayload = {
      userId: req.user.id,
      citizenName: resolvedCitizenName,
      schemeId,
      schemeName,
      ministry: ministry || "Government of India",
      state: resolvedState,
      documentsPending,
      nextAction: fraudResult.manualReviewRequired
        ? "Please keep identity, income, and address documents ready for manual verification."
        : nextAction || "Keep your documents ready for verification.",
      eta: fraudResult.manualReviewRequired ? "Manual review in progress" : eta || "5-7 working days",
      status: fraudResult.manualReviewRequired ? "under-review" : "pending",
      riskLevel: fraudResult.riskLevel || (documentsPending.length ? "medium" : "low"),
      fraudScore: fraudResult.fraudScore,
      fraudStatus: fraudResult.fraudStatus,
      fraudFlags: fraudResult.fraudFlags,
      manualReviewRequired: fraudResult.manualReviewRequired,
      applicationId: buildApplicationId(),
      steps: defaultSteps("pending", fraudResult),
    };

    let application;
    if (canUseMongo()) {
      application = await Application.create(applicationPayload);
    } else {
      application = {
        id: `mem-app-${memoryApplications.length + 1}`,
        ...applicationPayload,
        createdAt: new Date().toISOString(),
      };
      memoryApplications.push(application);
    }

    return res.status(201).json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to create application.", error: error.message });
  }
}

async function getApplications(req, res) {
  try {
    const applications = canUseMongo()
      ? await Application.find({ userId: req.user.id }).sort({ createdAt: -1 })
      : memoryApplications.filter((application) => application.userId === req.user.id).reverse();

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch applications.", error: error.message });
  }
}

async function getApplicationById(req, res) {
  try {
    const application = canUseMongo()
      ? await Application.findOne({ applicationId: req.params.applicationId, userId: req.user.id })
      : memoryApplications.find(
          (item) => item.applicationId === req.params.applicationId && item.userId === req.user.id,
        );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    return res.json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch application.", error: error.message });
  }
}

async function getAllApplicationsAdmin(req, res) {
  try {
    const applications = canUseMongo()
      ? await Application.find({}).sort({ createdAt: -1 }).limit(100)
      : [...memoryApplications].reverse();

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch applications.", error: error.message });
  }
}

async function updateApplicationStatusAdmin(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["approved", "pending", "under-review", "rejected", "processing"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    let application;

    if (canUseMongo()) {
      application = await Application.findOneAndUpdate(
        { applicationId: req.params.applicationId },
        { status },
        { new: true },
      );
    } else {
      application = memoryApplications.find((item) => item.applicationId === req.params.applicationId);
      if (application) {
        application.status = status;
      }
    }

    if (!application) {
      return res.status(404).json({ success: false, message: "Not found." });
    }

    return res.json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to update.", error: error.message });
  }
}

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  getAllApplicationsAdmin,
  updateApplicationStatusAdmin,
};
