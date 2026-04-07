import type { EligibilityResponse, EligibilitySchemeResult } from "@/lib/api";

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

export function getEligibilityFitLabel(score: number) {
  if (score >= 90) return "High confidence";
  if (score >= 75) return "Strong match";
  if (score >= 60) return "Worth reviewing";
  return "Low confidence";
}

export function getFallbackEligibilityResponse(): EligibilityResponse {
  const eligibleCount = fallbackSchemes.filter((scheme) => scheme.eligible).length;

  return {
    success: true,
    total_schemes_checked: fallbackSchemes.length,
    eligible_count: eligibleCount,
    results: fallbackSchemes,
    message: `Found ${eligibleCount} strong scheme matches based on your profile.`,
  };
}

function getSchemeDeadline(schemeId: string) {
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

  return deadlines[schemeId] ?? "Check official portal";
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

function buildEligibilityFactors(scheme: EligibilitySchemeResult) {
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
      label: "State availability check",
      met: !stateBlocked,
      weight: "high" as const,
      detail: scheme.state === "National" ? "Available across India." : `Available in ${scheme.state}.`,
    },
    {
      label: "Overall eligibility confidence",
      met: scheme.eligibility_score >= 70,
      weight: "high" as const,
      detail: `Current match score: ${scheme.eligibility_score}%`,
    },
    {
      label: "Income fit",
      met: !incomeBlocked,
      weight: "high" as const,
      detail: incomeBlocked ? reasons.find((reason) => reason.toLowerCase().includes("income is outside")) : "Income appears to fit the preferred band.",
    },
    {
      label: "Occupation alignment",
      met: !occupationConcern,
      weight: "medium" as const,
      detail: occupationConcern
        ? "Occupation may not be in the core target group."
        : "Occupation aligns with the target beneficiary group.",
    },
    {
      label: "Age criteria review",
      met: !ageConcern,
      weight: "medium" as const,
      detail: ageConcern
        ? reasons.find((reason) => reason.toLowerCase().includes("age should be between"))
        : "Age falls inside the preferred range.",
    },
    {
      label: "Documents and payout readiness",
      met: !bankConcern,
      weight: "low" as const,
      detail: bankConcern
        ? "A linked bank account may still be required."
        : "No major payout-readiness blockers are currently highlighted.",
    },
  ];
}

export function mapEligibilityResultsToSchemes(
  response: EligibilityResponse | null | undefined,
): SchemeViewModel[] {
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
      scheme.state === "National" ? "Pan-India" : scheme.state,
      scheme.eligible ? "Eligible now" : "Needs review",
    ];

    return {
      id: scheme.scheme_id,
      name: scheme.scheme_name,
      description: scheme.eligible
        ? `You appear to satisfy the core conditions for this ${scheme.category.toLowerCase()} benefit.`
        : `You are close, but some criteria still need attention before this scheme becomes a strong match.`,
      ministry: meta.ministry,
      category: scheme.category,
      eligibilityScore: scheme.eligibility_score,
      benefits: scheme.benefits,
      beneficiaries: meta.beneficiaries,
      deadline: scheme.eligible ? getSchemeDeadline(scheme.scheme_id) : undefined,
      tags,
      eligible: true,
      reasons: scheme.reasons,
      state: scheme.state,
      documents: scheme.documents_required?.length ? scheme.documents_required : meta.documents,
      nextSteps: scheme.next_steps?.length ? scheme.next_steps : meta.nextSteps,
      fitLabel: "Highly Eligible",
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
      eligibilityFactors: buildEligibilityFactors(scheme),
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
