const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Normalize frontend values to ML service expected values
function normalizeProfile(profile: CitizenProfile): CitizenProfile {
  const casteMap: Record<string, string> = {
    "OBC (Other Backward Classes)": "OBC",
    "SC (Scheduled Caste)": "SC",
    "ST (Scheduled Tribe)": "ST",
    "EWS (Economically Weaker Section)": "General",
  };
  const occupationMap: Record<string, string> = {
    "Self-Employed": "Self Employed",
    "Salaried Employee": "Salaried",
    "Business Owner": "Small Business Owner",
    "Government Employee": "Salaried",
  };

  return {
    ...profile,
    caste: casteMap[profile.caste] || profile.caste,
    occupation: occupationMap[profile.occupation] || profile.occupation,
  };
}

export interface CitizenProfile {
  age: number;
  gender: string;
  annual_income: number;
  caste: string;
  state: string;
  occupation: string;
  family_size?: number;
  land_owned?: number;
  has_bank_account?: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  category: string;
  benefits: string;
  eligibility_score: number;
  eligible: boolean;
  reasons: string[];
  state: string;
}

export interface EligibilityResponse {
  success: boolean;
  total_schemes_checked: number;
  eligible_count: number;
  results: Scheme[];
  message: string;
}

export interface ChatRequest {
  message: string;
  citizen_id?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
}

export async function checkEligibility(profile: CitizenProfile): Promise<EligibilityResponse> {
  const response = await fetch(`${API_BASE}/predict-eligibility`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizeProfile(profile)),
  });
  if (!response.ok) throw new Error("Failed to check eligibility");
  return response.json();
}

export async function getRecommendations(profile: CitizenProfile): Promise<{ recommendations: Scheme[] }> {
  const response = await fetch(`${API_BASE}/recommend-schemes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizeProfile(profile)),
  });
  if (!response.ok) throw new Error("Failed to get recommendations");
  return response.json();
}

export async function chat(message: string, citizenId?: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, citizen_id: citizenId }),
  });
  if (!response.ok) throw new Error("Failed to chat");
  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
