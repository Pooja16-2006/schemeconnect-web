import type { SchemeViewModel } from "@/lib/portal-data";

export interface SchemeDocumentRequirement {
  id: string;
  name: string;
  required: boolean;
  formats: string[];
  maxSizeMB: number;
  helpText?: string;
}

const DEFAULT_FORMATS = ["pdf", "jpg", "jpeg", "png"];

const SCHEME_DOCUMENTS: Record<string, SchemeDocumentRequirement[]> = {
  "1": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "land-record", name: "Land record", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "bank-passbook", name: "Bank passbook", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "2": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "income-certificate", name: "Income certificate", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "residence-proof", name: "Residence proof", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "3": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "ration-card", name: "Ration card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "family-id", name: "Family ID", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "13": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "ration-card", name: "Ration card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "bank-details", name: "Bank account details", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "14": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "degree-certificate", name: "Degree or diploma certificate", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "bank-details", name: "Bank account details", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "15": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "ration-card", name: "Ration card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "bpl-certificate", name: "BPL certificate", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "16": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "photo-id", name: "Valid photo ID", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "17": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "bpl-card", name: "BPL card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "ration-card", name: "Ration card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
  "18": [
    { id: "aadhaar", name: "Aadhaar card", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "land-records", name: "Land records", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
    { id: "bank-details", name: "Bank account details", required: true, formats: DEFAULT_FORMATS, maxSizeMB: 5 },
  ],
};

function toDocumentId(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSchemeDocuments(
  scheme: Pick<SchemeViewModel, "id" | "documents">,
): SchemeDocumentRequirement[] {
  if (SCHEME_DOCUMENTS[scheme.id]) {
    return SCHEME_DOCUMENTS[scheme.id];
  }

  const fallbackDocuments = scheme.documents.length
    ? scheme.documents
    : ["Aadhaar", "Income proof", "Address proof"];

  return fallbackDocuments.map((document, index) => ({
    id: `${toDocumentId(document) || "document"}-${index + 1}`,
    name: document,
    required: index < 2,
    formats: DEFAULT_FORMATS,
    maxSizeMB: 5,
  }));
}
