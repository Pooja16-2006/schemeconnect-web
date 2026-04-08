"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { submitApplicationWithDocuments, type ApplicationRecord } from "@/lib/api";
import { getSchemeDocuments, type SchemeDocumentRequirement } from "@/lib/scheme-documents";
import type { SchemeViewModel } from "@/lib/portal-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileUp, Upload, X } from "lucide-react";

type CitizenProfileSummary = {
  fullName?: string;
  age?: string;
  annualIncome?: string;
  caste?: string;
  state?: string;
  occupation?: string;
  gender?: string;
  residenceArea?: string;
  familySize?: string;
};

const STEPS = ["Confirm details", "Upload documents", "Review", "Done"] as const;

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getFileError(file: File, document: SchemeDocumentRequirement) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (!document.formats.includes(extension)) {
    return `Upload ${document.formats.map((format) => format.toUpperCase()).join(", ")} only.`;
  }

  if (file.size > document.maxSizeMB * 1024 * 1024) {
    return `File must be ${document.maxSizeMB} MB or smaller.`;
  }

  return null;
}

export function ApplicationForm({
  scheme,
  citizenProfile,
  onClose,
}: {
  scheme: SchemeViewModel;
  citizenProfile: CitizenProfileSummary | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uploads, setUploads] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<ApplicationRecord | null>(null);

  const documents = useMemo(() => getSchemeDocuments(scheme), [scheme]);
  const requiredDocuments = useMemo(() => documents.filter((document) => document.required), [documents]);

  function updateUpload(document: SchemeDocumentRequirement, file: File | null) {
    if (!file) {
      return;
    }

    const error = getFileError(file, document);
    if (error) {
      setErrors((current) => ({ ...current, [document.id]: error }));
      return;
    }

    setErrors((current) => {
      const next = { ...current };
      delete next[document.id];
      return next;
    });

    setUploads((current) => ({ ...current, [document.id]: file }));
  }

  function removeUpload(documentId: string) {
    setUploads((current) => {
      const next = { ...current };
      delete next[documentId];
      return next;
    });
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = new FormData();
      payload.append("citizenName", citizenProfile?.fullName || "");
      payload.append("schemeId", scheme.id);
      payload.append("schemeName", scheme.name);
      payload.append("ministry", scheme.ministry);
      payload.append("state", citizenProfile?.state || scheme.state);
      payload.append("documentsPending", JSON.stringify([]));
      payload.append("nextAction", scheme.nextSteps[0] || "Keep your acknowledgement ready for verification.");
      payload.append("eta", "5-7 working days");
      payload.append("documentRequirements", JSON.stringify(documents));

      for (const [documentId, file] of Object.entries(uploads)) {
        payload.append(documentId, file);
      }

      const response = await submitApplicationWithDocuments(payload);
      setApplication(response.application);
      sessionStorage.setItem("latestApplicationId", response.application.applicationId);
      setStep(3);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit application right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canContinueFromUploads = requiredDocuments.every((document) => uploads[document.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl">
        <div className="border-b bg-muted/30 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Scheme application</p>
              <h2 className="mt-1 text-2xl font-semibold">{scheme.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete the application flow and upload the required documents before submitting.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close application form">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {STEPS.map((label, index) => (
              <div key={label} className="space-y-2">
                <div className={`h-1.5 rounded-full ${index <= step ? "bg-primary" : "bg-border"}`} />
                <p className={`text-xs font-medium ${index === step ? "text-foreground" : "text-muted-foreground"}`}>
                  {index + 1}. {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              <Card className="border-2">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold">Applicant details</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Full name", citizenProfile?.fullName || "Not provided"],
                      ["Age", citizenProfile?.age || "Not provided"],
                      ["Annual income", citizenProfile?.annualIncome || "Not provided"],
                      ["State", citizenProfile?.state || "Not provided"],
                      ["Occupation", citizenProfile?.occupation || "Not provided"],
                      ["Family size", citizenProfile?.familySize || "Not provided"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border bg-muted/20 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="mt-2 font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold">Scheme checklist</h3>
                  <div className="mt-4 space-y-3">
                    {documents.map((document) => (
                      <div key={document.id} className="flex items-start justify-between rounded-2xl border bg-muted/20 p-4">
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {document.formats.map((format) => format.toUpperCase()).join(", ")} up to {document.maxSizeMB} MB
                          </p>
                          {document.helpText ? (
                            <p className="mt-1 text-xs text-muted-foreground">{document.helpText}</p>
                          ) : null}
                        </div>
                        <Badge variant={document.required ? "default" : "outline"}>
                          {document.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                Upload all required documents to continue. Files stay attached to this application record for review and tracking.
              </div>
              <div className="grid gap-4">
                {documents.map((document) => (
                  <Card key={document.id} className="border-2">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{document.name}</h3>
                            <Badge variant={document.required ? "default" : "outline"}>
                              {document.required ? "Required" : "Optional"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Accepted: {document.formats.map((format) => format.toUpperCase()).join(", ")}. Max {document.maxSizeMB} MB.
                          </p>
                        </div>

                        {uploads[document.id] ? (
                          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                            <div>
                              <p className="text-sm font-medium">{uploads[document.id].name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(uploads[document.id].size)}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeUpload(document.id)}>
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 py-4 text-sm transition-colors hover:border-primary hover:bg-primary/5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Choose file</p>
                              <p className="text-xs text-muted-foreground">Select a scanned copy or exported PDF.</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept={document.formats.map((format) => `.${format}`).join(",")}
                              onChange={(event) => updateUpload(document, event.target.files?.[0] || null)}
                            />
                          </label>
                        )}
                      </div>
                      {errors[document.id] ? <p className="mt-3 text-sm text-destructive">{errors[document.id]}</p> : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="border-2">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold">Review submission</h3>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border bg-muted/20 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Scheme</p>
                      <p className="mt-2 font-medium">{scheme.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{scheme.ministry}</p>
                    </div>
                    <div className="rounded-2xl border bg-muted/20 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Applicant</p>
                      <p className="mt-2 font-medium">{citizenProfile?.fullName || "Citizen profile"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {citizenProfile?.state || scheme.state} • {citizenProfile?.occupation || "Occupation not provided"}
                      </p>
                    </div>
                    {submitError ? (
                      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        {submitError}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold">Uploaded documents</h3>
                  <div className="mt-4 space-y-3">
                    {documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between rounded-2xl border bg-muted/20 p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <FileUp className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {uploads[document.id]?.name || (document.required ? "Missing" : "Not uploaded")}
                            </p>
                          </div>
                        </div>
                        <Badge variant={uploads[document.id] ? "default" : "outline"}>
                          {uploads[document.id] ? "Ready" : document.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mx-auto max-w-2xl">
              <Card className="border-2">
                <CardContent className="flex flex-col items-center px-6 py-10 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
                    <CheckCircle2 className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">Application submitted</h3>
                  <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                    Your documents and application have been recorded successfully. Use the application ID below to track verification progress.
                  </p>
                  <div className="mt-6 rounded-2xl border bg-muted/20 px-6 py-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Application ID</p>
                    <p className="mt-2 font-mono text-2xl font-semibold">{application?.applicationId}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button
                      onClick={() => {
                        onClose();
                        router.push("/track");
                      }}
                    >
                      Track application
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>

        {step < 3 ? (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <Button variant="ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep((current) => current + 1)} disabled={step === 1 && !canContinueFromUploads}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !canContinueFromUploads}>
                {isSubmitting ? "Submitting..." : "Submit application"}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
