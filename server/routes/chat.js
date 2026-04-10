const express = require("express");

const router = express.Router();

const schemeSummaries = [
  {
    match: ["ayushman", "abha", "health"],
    response:
      "Ayushman Bharat helps eligible families with cashless hospital treatment. Common documents are Aadhaar, ration card or family ID, and a mobile number for OTPs. If you want, I can also explain how to check eligibility or what to do next.",
  },
  {
    match: ["pm kisan", "kisan samman nidhi", "farmer", "agriculture"],
    response:
      "PM-KISAN gives eligible farmer households annual direct income support. Keep Aadhaar, land records, and a bank account ready. If you share your state and occupation, I can tell you what to verify first.",
  },
  {
    match: ["pm awas", "awas", "housing"],
    response:
      "PM Awas Yojana supports eligible families with housing assistance. You usually need Aadhaar, income proof, and residence proof. I can also list the steps to apply on the official portal.",
  },
  {
    match: ["mgnrega", "job card", "employment", "wage"],
    response:
      "MGNREGA supports rural households seeking wage employment. A job card, Aadhaar, and residence proof are commonly used. If you want, I can explain the registration flow or how to track a job card.",
  },
  {
    match: ["mudra", "loan", "business"],
    response:
      "MUDRA helps micro and small business owners access loan support through participating lenders. Common documents are Aadhaar, PAN, bank statement, and a short business plan. I can also help you prepare a simple checklist.",
  },
  {
    match: ["scholarship", "education", "student"],
    response:
      "For scholarships, the usual checks are course enrollment, income/category rules, mark sheets, and institution verification. If you tell me the scheme name, I can narrow it down.",
  },
  {
    match: ["gruha lakshmi", "shakti", "yuva nidhi", "raitha siri", "seva sindhu", "karnataka"],
    response:
      "For Karnataka schemes, Seva Sindhu is often the main portal. Common examples are Gruha Lakshmi, Shakti, Yuva Nidhi, and Raitha Siri. I can help with the documents, eligibility check, or application steps.",
  },
];

function normalize(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function findSchemeResponse(message) {
  const normalized = normalize(message);

  if (!normalized) {
    return "Please type a question about eligibility, documents, application steps, tracking, or a specific scheme.";
  }

  if (/^(hi|hello|hey|namaste|hola)$/.test(normalized)) {
    return "Namaste! I can help with scheme eligibility, documents, tracking, and Karnataka or central government schemes. Ask me anything about your application or the scheme name.";
  }

  if (normalized.includes("track") || normalized.includes("status") || normalized.includes("application id")) {
    return "To track an application, use the Track Status page and search with your application ID. If you share the scheme name, I can also tell you what the usual next step is.";
  }

  if (normalized.includes("document") || normalized.includes("papers") || normalized.includes("required docs") || normalized.includes("need to upload")) {
    return "Common documents include Aadhaar, bank passbook, income or caste certificate, residence proof, and any scheme-specific record like land papers, ration card, or student certificates. Tell me the scheme name and I’ll narrow it down.";
  }

  if (normalized.includes("eligib") || normalized.includes("qualify") || normalized.includes("am i eligible") || normalized.includes("check eligibility")) {
    return "Eligibility usually depends on your age, income, occupation, state, family details, and document records. Use the eligibility checker with your profile details, and I can help interpret the result if you share it here.";
  }

  if (normalized.includes("how to apply") || normalized.includes("apply") || normalized.includes("official portal")) {
    return "The usual flow is: verify eligibility, gather documents, open the official portal, submit the form, and save the acknowledgement or application ID. If you tell me the scheme, I can give a scheme-specific checklist.";
  }

  for (const item of schemeSummaries) {
    if (item.match.some((keyword) => normalized.includes(keyword))) {
      return item.response;
    }
  }

  return "I can help with scheme eligibility, documents, tracking, application steps, and Karnataka-specific welfare schemes. If you mention a scheme name, I’ll answer more specifically.";
}

router.post("/", (req, res) => {
  const message = req.body?.message || req.body?.text || "";
  const response = findSchemeResponse(message);

  return res.json({
    success: true,
    response,
  });
});

module.exports = router;