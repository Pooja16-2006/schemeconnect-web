import type { EligibilityResponse, EligibilitySchemeResult } from "@/lib/api";
import type { Locale } from "@/lib/i18n";

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
] as const;

export const casteCategories = [
  "General",
  "OBC (Other Backward Classes)",
  "SC (Scheduled Caste)",
  "ST (Scheduled Tribe)",
  "EWS (Economically Weaker Section)",
] as const;

export const occupations = [
  "Farmer",
  "Self-Employed",
  "Salaried Employee",
  "Daily Wage Worker",
  "Student",
  "Homemaker",
  "Unemployed",
  "Retired",
  "Business Owner",
  "Government Employee",
  "Other",
] as const;

export interface SchemeViewModel {
  id: string;
  name: string;
  description: string;
  ministry: string;
  category: string;
  eligibilityScore: number;
  benefits: string;
  beneficiaries: string;
  deadline?: string;
  tags: string[];
  eligible: boolean;
  reasons: string[];
  state: string;
  documents: string[];
  nextSteps: string[];
  fitLabel: string;
  confidenceLabel?: string;
  confidenceSummary?: {
    positives: number;
    concerns: number;
    blockers: number;
  };
  eligibilityFactors?: Array<{
    label: string;
    met: boolean;
    weight: "high" | "medium" | "low";
    detail?: string;
  }>;
}

const localeText = {
  en: {
    highConfidence: "High confidence",
    strongMatch: "Strong match",
    worthReviewing: "Worth reviewing",
    lowConfidence: "Low confidence",
    panIndia: "Pan-India",
    eligibleNow: "Eligible now",
    needsReview: "Needs review",
    eligibleDescription: (category: string) =>
      `You appear to satisfy the core conditions for this ${category.toLowerCase()} benefit.`,
    nearMatchDescription:
      "You are close, but some criteria still need attention before this scheme becomes a strong match.",
    stateAvailabilityCheck: "State availability check",
    stateAvailableAcrossIndia: "Available across India.",
    stateAvailableIn: (state: string) => `Available in ${state}.`,
    overallEligibilityConfidence: "Overall eligibility confidence",
    currentMatchScore: (score: number) => `Current match score: ${score}%`,
    incomeFit: "Income fit",
    incomeFits: "Income appears to fit the preferred band.",
    occupationAlignment: "Occupation alignment",
    occupationTargetMismatch: "Occupation may not be in the core target group.",
    occupationTargetMatch: "Occupation aligns with the target beneficiary group.",
    ageCriteriaReview: "Age criteria review",
    ageInRange: "Age falls inside the preferred range.",
    docsAndPayoutReadiness: "Documents and payout readiness",
    payoutReadinessBlocked: "A linked bank account may still be required.",
    payoutReadinessClean: "No major payout-readiness blockers are currently highlighted.",
    highlyEligible: "Highly Eligible",
    fallbackMessage: (count: number) => `Found ${count} strong scheme matches based on your profile.`,
    openEnrollment: "Open enrollment",
    checkOfficialPortal: "Check official portal",
  },
  hi: {
    highConfidence: "उच्च विश्वास",
    strongMatch: "मजबूत मिलान",
    worthReviewing: "समीक्षा योग्य",
    lowConfidence: "कम विश्वास",
    panIndia: "संपूर्ण भारत",
    eligibleNow: "अभी पात्र",
    needsReview: "समीक्षा आवश्यक",
    eligibleDescription: (_category: string) => "आप इस लाभ के मुख्य मानदंडों को पूरा करते हुए दिखाई देते हैं।",
    nearMatchDescription:
      "आप करीब हैं, लेकिन इस योजना के मजबूत मिलान बनने से पहले कुछ मानदंडों पर ध्यान देना होगा।",
    stateAvailabilityCheck: "राज्य उपलब्धता जांच",
    stateAvailableAcrossIndia: "भारत भर में उपलब्ध।",
    stateAvailableIn: (state: string) => `${state} में उपलब्ध।`,
    overallEligibilityConfidence: "कुल पात्रता विश्वास",
    currentMatchScore: (score: number) => `वर्तमान मिलान स्कोर: ${score}%`,
    incomeFit: "आय उपयुक्तता",
    incomeFits: "आय पसंदीदा सीमा में प्रतीत होती है।",
    occupationAlignment: "पेशा अनुरूपता",
    occupationTargetMismatch: "पेशा मुख्य लक्षित समूह में नहीं हो सकता।",
    occupationTargetMatch: "पेशा लक्षित लाभार्थी समूह से मेल खाता है।",
    ageCriteriaReview: "आयु मानदंड समीक्षा",
    ageInRange: "आयु पसंदीदा सीमा में है।",
    docsAndPayoutReadiness: "दस्तावेज़ और भुगतान तैयारी",
    payoutReadinessBlocked: "लिंक किया गया बैंक खाता अभी भी आवश्यक हो सकता है।",
    payoutReadinessClean: "फिलहाल भुगतान तैयारी में कोई बड़ा अवरोध नहीं दिख रहा है।",
    highlyEligible: "अत्यधिक पात्र",
    fallbackMessage: (count: number) => `आपकी प्रोफ़ाइल के आधार पर ${count} मजबूत योजना मिलान मिले।`,
    openEnrollment: "खुला पंजीकरण",
    checkOfficialPortal: "आधिकारिक पोर्टल देखें",
  },
  kn: {
    highConfidence: "ಹೆಚ್ಚಿನ ವಿಶ್ವಾಸ",
    strongMatch: "ಬಲವಾದ ಹೊಂದಾಣಿಕೆ",
    worthReviewing: "ಪರಿಶೀಲನೆಗೆ ಯೋಗ್ಯ",
    lowConfidence: "ಕಡಿಮೆ ವಿಶ್ವಾಸ",
    panIndia: "ಭಾರತವ್ಯಾಪಿ",
    eligibleNow: "ಈಗ ಅರ್ಹ",
    needsReview: "ಪರಿಶೀಲನೆ ಅಗತ್ಯ",
    eligibleDescription: (_category: string) => "ಈ ಪ್ರಯೋಜನದ ಪ್ರಮುಖ ಮಾನದಂಡಗಳನ್ನು ನೀವು ಪೂರೈಸಿರುವಂತೆ ಕಾಣುತ್ತದೆ.",
    nearMatchDescription:
      "ನೀವು ಹತ್ತಿರದಲ್ಲಿದ್ದರೂ, ಈ ಯೋಜನೆ ಬಲವಾದ ಹೊಂದಾಣಿಕೆಯಾಗಲು ಇನ್ನೂ ಕೆಲವು ಮಾನದಂಡಗಳಿಗೆ ಗಮನ ಬೇಕಿದೆ.",
    stateAvailabilityCheck: "ರಾಜ್ಯ ಲಭ್ಯತೆ ಪರಿಶೀಲನೆ",
    stateAvailableAcrossIndia: "ಭಾರತದಾದ್ಯಂತ ಲಭ್ಯ.",
    stateAvailableIn: (state: string) => `${state} ನಲ್ಲಿ ಲಭ್ಯ.`,
    overallEligibilityConfidence: "ಒಟ್ಟು ಅರ್ಹತಾ ವಿಶ್ವಾಸ",
    currentMatchScore: (score: number) => `ಪ್ರಸ್ತುತ ಹೊಂದಾಣಿಕೆ ಅಂಕ: ${score}%`,
    incomeFit: "ಆದಾಯ ಹೊಂದಾಣಿಕೆ",
    incomeFits: "ಆದಾಯವು ಆದ್ಯತೆಯ ಮಿತಿಗೆ ಹೊಂದುವಂತೆ ಕಾಣುತ್ತದೆ.",
    occupationAlignment: "ಉದ್ಯೋಗ ಹೊಂದಾಣಿಕೆ",
    occupationTargetMismatch: "ಉದ್ಯೋಗವು ಮುಖ್ಯ ಗುರಿ ಗುಂಪಿಗೆ ಸೇರದಿರಬಹುದು.",
    occupationTargetMatch: "ಉದ್ಯೋಗವು ಗುರಿ ಪ್ರಯೋಜನಾರ್ಥಿ ಗುಂಪಿಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.",
    ageCriteriaReview: "ವಯಸ್ಸಿನ ಮಾನದಂಡ ಪರಿಶೀಲನೆ",
    ageInRange: "ವಯಸ್ಸು ಆದ್ಯತೆಯ ಮಿತಿಯೊಳಗೆ ಬರುತ್ತದೆ.",
    docsAndPayoutReadiness: "ದಾಖಲೆ ಮತ್ತು ಪಾವತಿ ಸಿದ್ಧತೆ",
    payoutReadinessBlocked: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಲಿಂಕ್ ಇನ್ನೂ ಅಗತ್ಯವಾಗಿರಬಹುದು.",
    payoutReadinessClean: "ಈಗಾಗಲೇ ಪಾವತಿ ಸಿದ್ಧತೆಯಲ್ಲಿ ದೊಡ್ಡ ಅಡಚಣೆಗಳು ಕಾಣುತ್ತಿಲ್ಲ.",
    highlyEligible: "ಅತ್ಯಂತ ಅರ್ಹ",
    fallbackMessage: (count: number) => `ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಧರಿಸಿ ${count} ಬಲವಾದ ಯೋಜನೆ ಹೊಂದಾಣಿಕೆಗಳು ಸಿಕ್ಕಿವೆ.`,
    openEnrollment: "ಮುಕ್ತ ನೋಂದಣಿ",
    checkOfficialPortal: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ",
  },
} as const;

const localizedBenefitsBySchemeId: Partial<Record<string, Record<Exclude<Locale, "en">, string>>> = {
  "3": {
    hi: "परिवार के लिए प्रति वर्ष रु. 5 लाख तक स्वास्थ्य कवर।",
    kn: "ಒಂದು ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ರೂ. 5 ಲಕ್ಷದವರೆಗೆ ಆರೋಗ್ಯ ಕವರ್.",
  },
};

function getLocaleText(locale: Locale) {
  return localeText[locale] ?? localeText.en;
}

function getLocalizedBenefitSummary(
  scheme: Pick<EligibilitySchemeResult, "scheme_id" | "benefits">,
  locale: Locale,
) {
  if (locale === "en") {
    return scheme.benefits;
  }

  return localizedBenefitsBySchemeId[scheme.scheme_id]?.[locale] ?? scheme.benefits;
}

const categoryMeta: Record<
  string,
  {
    ministry: string;
    beneficiaries: string;
    documents: string[];
    nextSteps: string[];
  }
> = {
  Agriculture: {
    ministry: "Ministry of Agriculture and Farmers Welfare",
    beneficiaries: "Farmers and rural households",
    documents: ["Aadhaar", "Land record", "Bank passbook"],
    nextSteps: ["Verify land ownership details", "Confirm bank seeding", "Submit through CSC or portal"],
  },
  Housing: {
    ministry: "Ministry of Housing and Urban Affairs",
    beneficiaries: "Economically vulnerable families",
    documents: ["Aadhaar", "Income certificate", "Residence proof"],
    nextSteps: ["Check local body approval list", "Upload residence documents", "Track field verification"],
  },
  Health: {
    ministry: "Ministry of Health and Family Welfare",
    beneficiaries: "Families needing medical support",
    documents: ["Aadhaar", "Ration card", "Family ID"],
    nextSteps: ["Confirm family details", "Locate empanelled hospital", "Carry e-card or ID proof"],
  },
  Education: {
    ministry: "Ministry of Education",
    beneficiaries: "Students and eligible families",
    documents: ["Student ID", "Income certificate", "Caste certificate"],
    nextSteps: ["Collect academic records", "Verify scholarship window", "Submit institution details"],
  },
  Finance: {
    ministry: "Ministry of Finance",
    beneficiaries: "Entrepreneurs and account holders",
    documents: ["Aadhaar", "Bank statement", "Business proof"],
    nextSteps: ["Prepare bank-linked application", "Confirm business profile", "Visit lending partner if needed"],
  },
  Employment: {
    ministry: "Ministry of Rural Development",
    beneficiaries: "Workers seeking livelihood support",
    documents: ["Aadhaar", "Job card", "Residence proof"],
    nextSteps: ["Verify job card status", "Check local gram panchayat records", "Track work allocation"],
  },
  "Women Welfare": {
    ministry: "Government of Karnataka",
    beneficiaries: "Women-led households and women beneficiaries",
    documents: ["Aadhaar", "Family card", "Bank account details"],
    nextSteps: ["Confirm eligibility on Seva Sindhu", "Prepare household records", "Track district approval status"],
  },
  Transport: {
    ministry: "Government of Karnataka",
    beneficiaries: "Women commuters and eligible citizens",
    documents: ["Aadhaar", "State ID", "Registration proof"],
    nextSteps: ["Register for the state service", "Validate identity details", "Use approved benefit pass"],
  },
  "Food Security": {
    ministry: "Department of Food, Civil Supplies and Consumer Affairs",
    beneficiaries: "Priority households needing food support",
    documents: ["Ration card", "Aadhaar", "Residence proof"],
    nextSteps: ["Verify ration card category", "Confirm family details", "Track local distribution updates"],
  },
  Pension: {
    ministry: "Ministry of Labour and Employment",
    beneficiaries: "Citizens seeking retirement support",
    documents: ["Aadhaar", "Bank passbook", "Age proof"],
    nextSteps: ["Validate age criteria", "Link bank account", "Choose contribution plan"],
  },
  "Social Security": {
    ministry: "Ministry of Social Justice and Empowerment",
    beneficiaries: "Priority and vulnerable households",
    documents: ["Aadhaar", "Income certificate", "Residence proof"],
    nextSteps: ["Confirm beneficiary category", "Prepare certificates", "Track district approval status"],
  },
};

const fallbackSchemes: EligibilitySchemeResult[] = [
  {
    scheme_id: "1",
    scheme_name: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    benefits: "Rs. 6,000 per year direct income support for small and marginal farmers.",
    eligibility_score: 95,
    eligible: true,
    reasons: [],
    state: "National",
    documents_required: ["Aadhaar", "Land record", "Bank passbook"],
    next_steps: ["Confirm land ownership", "Validate bank linkage", "Submit through PM-Kisan portal"],
  },
  {
    scheme_id: "3",
    scheme_name: "Ayushman Bharat",
    category: "Health",
    benefits: "Health cover up to Rs. 5 lakh per family for hospitalisation.",
    eligibility_score: 90,
    eligible: true,
    reasons: [],
    state: "National",
    documents_required: ["Aadhaar", "Family ID", "Ration card"],
    next_steps: ["Check empanelled hospitals", "Verify family details", "Carry scheme ID for treatment"],
  },
  {
    scheme_id: "2",
    scheme_name: "PM Awas Yojana",
    category: "Housing",
    benefits: "Financial assistance for building or upgrading a pucca house.",
    eligibility_score: 82,
    eligible: true,
    reasons: [],
    state: "National",
    documents_required: ["Aadhaar", "Income certificate", "Residence proof"],
    next_steps: ["Verify housing category", "Upload residence documents", "Track local body verification"],
  },
  {
    scheme_id: "7",
    scheme_name: "MGNREGA",
    category: "Employment",
    benefits: "Guaranteed 100 days of wage employment for rural households.",
    eligibility_score: 68,
    eligible: false,
    reasons: ["Income is near the upper preference range for this scheme."],
    state: "National",
    documents_required: ["Aadhaar", "Residence proof", "Job card request"],
    next_steps: ["Request job card", "Visit gram panchayat if needed", "Track work allocation"],
  },
  {
    scheme_id: "13",
    scheme_name: "Gruha Lakshmi Scheme",
    category: "Women Welfare",
    benefits: "Rs. 2,000 per month transferred directly to the woman head of family.",
    eligibility_score: 88,
    eligible: true,
    reasons: [],
    state: "Karnataka",
    documents_required: ["Aadhaar", "Ration card", "Bank account details"],
    next_steps: ["Register on Seva Sindhu", "Submit Aadhaar-linked bank details", "Track payment status"],
  },
  {
    scheme_id: "14",
    scheme_name: "Yuva Nidhi Scheme",
    category: "Employment",
    benefits: "Rs. 3,000 per month for degree holders and Rs. 1,500 for diploma holders who are unemployed.",
    eligibility_score: 85,
    eligible: true,
    reasons: [],
    state: "Karnataka",
    documents_required: ["Aadhaar", "Degree certificate", "Bank account details"],
    next_steps: ["Register on Seva Sindhu", "Upload degree or diploma certificate", "Track monthly payment"],
  },
  {
    scheme_id: "15",
    scheme_name: "Anna Bhagya Scheme",
    category: "Food Security",
    benefits: "10 kg free rice per month per eligible family for priority households.",
    eligibility_score: 82,
    eligible: true,
    reasons: [],
    state: "Karnataka",
    documents_required: ["Aadhaar", "Ration card", "BPL certificate"],
    next_steps: ["Verify ration card category", "Link Aadhaar to ration card", "Collect monthly allocation"],
  },
  {
    scheme_id: "16",
    scheme_name: "Shakti Scheme",
    category: "Transport",
    benefits: "Free bus travel for women across Karnataka on state-run buses.",
    eligibility_score: 95,
    eligible: true,
    reasons: [],
    state: "Karnataka",
    documents_required: ["Aadhaar", "Any valid photo ID"],
    next_steps: ["Register or verify identity on Seva Sindhu", "Carry approved ID", "Use the benefit on eligible routes"],
  },
  {
    scheme_id: "17",
    scheme_name: "Arogya Karnataka",
    category: "Health",
    benefits: "Free healthcare support up to Rs. 5 lakh per year for eligible families in Karnataka.",
    eligibility_score: 80,
    eligible: true,
    reasons: [],
    state: "Karnataka",
    documents_required: ["Aadhaar", "BPL card", "Ration card"],
    next_steps: ["Enroll at a government facility", "Generate or verify health card", "Use at empanelled hospitals"],
  },
  {
    scheme_id: "18",
    scheme_name: "Raitha Siri Scheme",
    category: "Agriculture",
    benefits: "Rs. 5,000 financial assistance to drought-affected farmers in Karnataka.",
    eligibility_score: 86,
    eligible: true,
    reasons: [],
    state: "Karnataka",
    documents_required: ["Aadhaar", "Land records", "Bank account details"],
    next_steps: ["Register at Raitha Samparka Kendra", "Submit land documents", "Track payment status"],
  },
];

export function getEligibilityFitLabel(score: number, locale: Locale = "en") {
  const text = getLocaleText(locale);
  if (score >= 90) return text.highConfidence;
  if (score >= 75) return text.strongMatch;
  if (score >= 60) return text.worthReviewing;
  return text.lowConfidence;
}

export function getFallbackEligibilityResponse(): EligibilityResponse {
  const eligibleCount = fallbackSchemes.filter((scheme) => scheme.eligible).length;

  return {
    success: true,
    total_schemes_checked: fallbackSchemes.length,
    eligible_count: eligibleCount,
    results: fallbackSchemes,
    message: localeText.en.fallbackMessage(eligibleCount),
  };
}

function getSchemeDeadline(schemeId: string, locale: Locale = "en") {
  const deadlines: Record<string, string> = {
    "1": "31 March 2027",
    "2": "30 June 2026",
    "3": "Open enrollment",
    "4": "31 May 2026",
    "5": "Open enrollment",
    "6": "Open enrollment",
    "7": "Open enrollment",
    "8": "31 December 2026",
    "9": "30 June 2026",
    "10": "31 March 2027",
    "11": "Open enrollment",
    "12": "Open enrollment",
    "13": "30 June 2026",
    "14": "31 March 2027",
    "15": "Open enrollment",
    "16": "Open enrollment",
    "17": "Open enrollment",
    "18": "31 July 2026",
  };

  const text = getLocaleText(locale);
  const value = deadlines[schemeId];
  if (!value) {
    return text.checkOfficialPortal;
  }

  if (value === "Open enrollment") {
    return text.openEnrollment;
  }

  return value;
}

function isFemaleProfileValue(value: string | undefined | null) {
  const normalized = value?.toLowerCase();
  return normalized === "female" || normalized === "f" || normalized === "woman";
}

function getStoredProfileGender() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedProfile = JSON.parse(sessionStorage.getItem("profileData") || "{}");
    const gender = typeof storedProfile.gender === "string" ? storedProfile.gender : null;
    return gender;
  } catch {
    return null;
  }
}

function getStoredEligibilityProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedProfile = JSON.parse(sessionStorage.getItem("profile") || "{}");
    return storedProfile as {
      occupation?: string;
      land_owned?: number;
      residence_area?: string;
      state?: string;
    };
  } catch {
    return null;
  }
}

function isPmKisanScheme(scheme: Pick<EligibilitySchemeResult, "scheme_name" | "scheme_id">) {
  const haystack = scheme.scheme_name.toLowerCase();
  return scheme.scheme_id === "1" || haystack.includes("pm kisan");
}

function isFarmerProfile(profile: { occupation?: string; land_owned?: number; residence_area?: string } | null) {
  if (!profile) {
    return false;
  }

  const occupation = profile.occupation?.toLowerCase() ?? "";
  const landOwned = Number(profile.land_owned ?? 0);
  const residenceArea = profile.residence_area?.toLowerCase() ?? "";

  return (occupation.includes("farmer") || landOwned > 0) && residenceArea === "rural";
}

function isWomenOnlyScheme(
  scheme: Pick<EligibilitySchemeResult, "scheme_name" | "benefits" | "category">,
) {
  const womenOnlyKeywords = [
    "women",
    "woman",
    "female",
    "girl",
    "girls",
    "mahila",
    "lakshmi",
    "shakti",
    "widow",
    "mother",
    "mothers",
    "pregnan",
    "maternal",
  ];
  const categoryBeneficiaries = categoryMeta[scheme.category]?.beneficiaries ?? "";
  const haystack = `${scheme.scheme_name} ${scheme.benefits} ${scheme.category} ${categoryBeneficiaries}`.toLowerCase();
  return womenOnlyKeywords.some((keyword) => haystack.includes(keyword));
}

function buildEligibilityFactors(scheme: EligibilitySchemeResult, locale: Locale = "en") {
  const text = getLocaleText(locale);
  const factors = (scheme as EligibilitySchemeResult & {
    confidence_factors?: {
      factors?: Array<{
        factor: string;
        impact: string;
        detail?: string;
        weight?: number | null;
      }>;
    };
  }).confidence_factors?.factors;

  if (factors?.length) {
    return factors.map((factor) => ({
      label: factor.factor,
      met: factor.impact === "positive" || factor.impact === "neutral",
      weight: (
        factor.weight && factor.weight >= 20
          ? "high"
          : factor.weight && factor.weight >= 10
            ? "medium"
            : "low"
      ) as "high" | "medium" | "low",
      detail: factor.detail,
    }));
  }

  const reasons = scheme.reasons ?? [];
  const stateBlocked = reasons.some((reason) => reason.toLowerCase().includes("only available in"));
  const incomeBlocked = reasons.some((reason) => reason.toLowerCase().includes("income is outside"));
  const ageConcern = reasons.some((reason) => reason.toLowerCase().includes("age should be between"));
  const occupationConcern = reasons.some((reason) => reason.toLowerCase().includes("occupation does not match"));
  const bankConcern = reasons.some((reason) => reason.toLowerCase().includes("bank account"));

  return [
    {
      label: text.stateAvailabilityCheck,
      met: !stateBlocked,
      weight: "high" as const,
      detail:
        scheme.state === "National"
          ? text.stateAvailableAcrossIndia
          : text.stateAvailableIn(scheme.state),
    },
    {
      label: text.overallEligibilityConfidence,
      met: scheme.eligibility_score >= 70,
      weight: "high" as const,
      detail: text.currentMatchScore(scheme.eligibility_score),
    },
    {
      label: text.incomeFit,
      met: !incomeBlocked,
      weight: "high" as const,
      detail: incomeBlocked ? reasons.find((reason) => reason.toLowerCase().includes("income is outside")) : text.incomeFits,
    },
    {
      label: text.occupationAlignment,
      met: !occupationConcern,
      weight: "medium" as const,
      detail: occupationConcern
        ? text.occupationTargetMismatch
        : text.occupationTargetMatch,
    },
    {
      label: text.ageCriteriaReview,
      met: !ageConcern,
      weight: "medium" as const,
      detail: ageConcern
        ? reasons.find((reason) => reason.toLowerCase().includes("age should be between"))
        : text.ageInRange,
    },
    {
      label: text.docsAndPayoutReadiness,
      met: !bankConcern,
      weight: "low" as const,
      detail: bankConcern
        ? text.payoutReadinessBlocked
        : text.payoutReadinessClean,
    },
  ];
}

export function mapEligibilityResultsToSchemes(
  response: EligibilityResponse | null | undefined,
  locale: Locale = "en",
): SchemeViewModel[] {
  const text = getLocaleText(locale);
  const storedGender = getStoredProfileGender();
  const storedEligibilityProfile = getStoredEligibilityProfile();
  const filterGenderRestrictedSchemes = (
    scheme: Pick<EligibilitySchemeResult, "scheme_name" | "benefits" | "category" | "scheme_id">,
  ) => {
    if (isPmKisanScheme(scheme) && !isFarmerProfile(storedEligibilityProfile)) {
      return false;
    }

    if (!isWomenOnlyScheme(scheme)) {
      return true;
    }

    if (!storedGender) {
      return false;
    }

    return isFemaleProfileValue(storedGender);
  };

  const filteredFallback = fallbackSchemes.filter(filterGenderRestrictedSchemes);
  const filteredResults = response?.results?.filter(filterGenderRestrictedSchemes) ?? [];

  const source = filteredResults.length ? filteredResults : filteredFallback;

  return source.map((scheme) => {
    const meta = categoryMeta[scheme.category] ?? {
      ministry: "Government of India",
      beneficiaries: "Eligible citizens",
      documents: ["Aadhaar", "Income proof", "Address proof"],
      nextSteps: ["Review eligibility", "Prepare required documents", "Submit application"],
    };

    const tags = [
      scheme.category,
      scheme.state === "National" ? text.panIndia : scheme.state,
      scheme.eligible ? text.eligibleNow : text.needsReview,
    ];

    return {
      id: scheme.scheme_id,
      name: scheme.scheme_name,
      description: scheme.eligible
        ? text.eligibleDescription(scheme.category)
        : text.nearMatchDescription,
      ministry: meta.ministry,
      category: scheme.category,
      eligibilityScore: scheme.eligibility_score,
      benefits: getLocalizedBenefitSummary(scheme, locale),
      beneficiaries: meta.beneficiaries,
      deadline: scheme.eligible ? getSchemeDeadline(scheme.scheme_id, locale) : undefined,
      tags,
      eligible: true,
      reasons: scheme.reasons,
      state: scheme.state,
      documents: scheme.documents_required?.length ? scheme.documents_required : meta.documents,
      nextSteps: scheme.next_steps?.length ? scheme.next_steps : meta.nextSteps,
      fitLabel: text.highlyEligible,
      confidenceLabel: (scheme as EligibilitySchemeResult & { confidence_label?: string }).confidence_label ?? undefined,
      confidenceSummary: (
        scheme as EligibilitySchemeResult & {
          confidence_factors?: {
            summary?: {
              positives: number;
              concerns: number;
              blockers: number;
            };
          };
        }
      ).confidence_factors?.summary ?? undefined,
      eligibilityFactors: buildEligibilityFactors(scheme, locale),
    };
  });
}

export function formatIndianCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
