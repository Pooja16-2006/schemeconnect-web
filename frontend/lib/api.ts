function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  return "http://localhost:5000/api";
}

async function parseResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : fallbackMessage;
    throw new Error(message);
  }

  if (payload === null) {
    throw new Error(fallbackMessage);
  }

  return payload as T;
}

function getAuthHeaders() {
  const headers: Record<string, string> = {};

  if (typeof window === "undefined") {
    return headers;
  }

  const token = localStorage.getItem("schemeconnect_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getAdminHeaders() {
  const headers: Record<string, string> = {};

  if (typeof window === "undefined") {
    return headers;
  }

  const token = localStorage.getItem("schemeconnect_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

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
  residence_area?: "rural" | "urban";
  family_size?: number;
  land_owned?: number;
  has_bank_account?: boolean;
}

export interface EligibilitySchemeResult {
  scheme_id: string;
  scheme_name: string;
  category: string;
  benefits: string;
  eligibility_score: number;
  eligible: boolean;
  reasons: string[];
  state: string;
  documents_required?: string[];
  next_steps?: string[];
  match_type?: string;
  ml_probability?: number | null;
}

export interface EligibilityResponse {
  success: boolean;
  total_schemes_checked: number;
  eligible_count: number;
  results: EligibilitySchemeResult[];
  message: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "citizen" | "admin";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "error";
  date?: string;
  remarks?: string;
}

export interface UploadedDocumentRecord {
  fieldId: string;
  label?: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  relativePath: string;
  uploadedAt?: string;
}

export interface ApplicationRecord {
  id?: string;
  _id?: string;
  applicationId: string;
  schemeId: string;
  schemeName: string;
  ministry?: string;
  state?: string;
  citizenName?: string;
  status: "approved" | "pending" | "under-review" | "rejected" | "processing";
  riskLevel: "low" | "medium" | "high";
  fraudScore?: number;
  fraudStatus?: string;
  fraudFlags?: string[];
  manualReviewRequired?: boolean;
  nextAction: string;
  eta: string;
  documentsPending: string[];
  documents?: Record<string, UploadedDocumentRecord>;
  steps: ApplicationStep[];
  createdAt?: string;
}

export interface CreateApplicationPayload {
  citizenName?: string;
  schemeId: string;
  schemeName: string;
  ministry?: string;
  state?: string;
  documentsPending?: string[];
  nextAction?: string;
  eta?: string;
}

export async function checkEligibility(profile: CitizenProfile): Promise<EligibilityResponse> {
  const response = await fetch(`${getApiBase()}/predict-eligibility`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizeProfile(profile)),
  });
  return parseResponse<EligibilityResponse>(response, "Failed to check eligibility");
}

export async function getRecommendations(
  profile: CitizenProfile,
): Promise<{ recommendations: EligibilitySchemeResult[] }> {
  const response = await fetch(`${getApiBase()}/recommend-schemes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizeProfile(profile)),
  });
  return parseResponse<{ recommendations: EligibilitySchemeResult[] }>(response, "Failed to get recommendations");
}

export async function chat(message: string, citizenId?: string): Promise<ChatResponse> {
  const response = await fetch(`${getApiBase()}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, citizen_id: citizenId }),
  });
  return parseResponse<ChatResponse>(response, "Failed to chat");
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: "citizen" | "admin";
}): Promise<AuthResponse> {
  const response = await fetch(`${getApiBase()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<AuthResponse>(response, "Failed to register");
}

export async function loginUser(payload: { email: string; password: string }): Promise<AuthResponse> {
  const response = await fetch(`${getApiBase()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<AuthResponse>(response, "Failed to login");
}

export async function getCurrentUser(): Promise<{ success: boolean; user: AuthUser }> {
  const response = await fetch(`${getApiBase()}/auth/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseResponse<{ success: boolean; user: AuthUser }>(response, "Failed to fetch user");
}

export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<{ success: boolean; application: ApplicationRecord }> {
  const response = await fetch(`${getApiBase()}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return parseResponse<{ success: boolean; application: ApplicationRecord }>(response, "Failed to create application");
}

export async function submitApplicationWithDocuments(
  payload: FormData,
): Promise<{ success: boolean; application: ApplicationRecord }> {
  const response = await fetch(`${getApiBase()}/applications`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: payload,
  });

  return parseResponse<{ success: boolean; application: ApplicationRecord }>(
    response,
    "Failed to submit application",
  );
}

export async function getApplications(): Promise<{ success: boolean; applications: ApplicationRecord[] }> {
  const response = await fetch(`${getApiBase()}/applications`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseResponse<{ success: boolean; applications: ApplicationRecord[] }>(response, "Failed to fetch applications");
}

export async function getApplicationById(
  applicationId: string,
): Promise<{ success: boolean; application: ApplicationRecord }> {
  const response = await fetch(`${getApiBase()}/applications/${applicationId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseResponse<{ success: boolean; application: ApplicationRecord }>(response, "Failed to fetch application");
}

export async function getAdminApplications(): Promise<{ success: boolean; applications: ApplicationRecord[] }> {
  const response = await fetch(`${getApiBase()}/applications/admin/all`, {
    headers: {
      ...getAdminHeaders(),
    },
  });
  return parseResponse<{ success: boolean; applications: ApplicationRecord[] }>(
    response,
    "Failed to fetch admin applications",
  );
}

export async function updateAdminApplicationStatus(
  applicationId: string,
  status: ApplicationRecord["status"],
): Promise<{ success: boolean; application: ApplicationRecord }> {
  const response = await fetch(`${getApiBase()}/applications/admin/${applicationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAdminHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  return parseResponse<{ success: boolean; application: ApplicationRecord }>(
    response,
    "Failed to update application status",
  );
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBase()}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
