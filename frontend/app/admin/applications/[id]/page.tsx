"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, XCircle, Activity, FileText, Shield, User, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This maps the hardcoded sample data to full details
const applicationDetails: Record<string, any> = {
  "PM-KISAN-2024-8765432": {
    id: "PM-KISAN-2024-8765432",
    scheme: "PM Kisan Samman Nidhi",
    applicant: "Ramesh Kumar",
    state: "Uttar Pradesh",
    status: "approved",
    date: "2 hours ago",
    ministry: "Ministry of Agriculture",
    fraudScore: 6,
    fraudStatus: "Clean",
    riskLevel: "low",
    fraudFlags: [],
    manualReviewRequired: false,
    nextAction: "Benefit will be credited in the next cycle.",
    eta: "Completed",
    documentsPending: [],
    steps: [
      { id: "s1", title: "Application Submitted", description: "Application was received successfully.", status: "completed", date: "10 November 2024" },
      { id: "s2", title: "Document Verification", description: "Documents and land details were validated.", status: "completed", date: "21 November 2024" },
      { id: "s3", title: "Benefit Approved", description: "Application approved for payout.", status: "completed", date: "1 December 2024" },
    ],
  },
  "PMAY-G-2024-1234567": {
    id: "PMAY-G-2024-1234567",
    scheme: "PM Awas Yojana",
    applicant: "Sunita Devi",
    state: "Bihar",
    status: "pending",
    date: "3 hours ago",
    ministry: "Ministry of Housing and Urban Affairs",
    fraudScore: 22,
    fraudStatus: "Clean",
    riskLevel: "low",
    fraudFlags: [],
    manualReviewRequired: false,
    nextAction: "Wait for district verification team response.",
    eta: "5-7 working days",
    documentsPending: ["Income Certificate"],
    steps: [
      { id: "s1", title: "Application Submitted", description: "Application was received successfully.", status: "completed", date: "Today" },
      { id: "s2", title: "Document Verification", description: "Documents are being validated.", status: "current" },
      { id: "s3", title: "Department Review", description: "Scheme department review.", status: "pending" },
      { id: "s4", title: "Final Decision", description: "Application will be approved or rejected.", status: "pending" },
    ],
  },
  "UJJWALA-2024-9876543": {
    id: "UJJWALA-2024-9876543",
    scheme: "PM Ujjwala Yojana",
    applicant: "Lakshmi Bai",
    state: "Madhya Pradesh",
    status: "under-review",
    date: "4 hours ago",
    ministry: "Ministry of Petroleum and Natural Gas",
    fraudScore: 48,
    fraudStatus: "Flagged for review",
    riskLevel: "medium",
    fraudFlags: ["Profile needs manual verification before benefit routing."],
    manualReviewRequired: true,
    nextAction: "Please upload additional identity proof for review.",
    eta: "Manual review in progress",
    documentsPending: ["Aadhaar", "BPL Certificate"],
    steps: [
      { id: "s1", title: "Application Submitted", description: "Application was received successfully.", status: "completed", date: "Today" },
      { id: "s0", title: "Fraud Review Screening", description: "Application routed for additional verification.", status: "current", remarks: "Manual verification requested." },
      { id: "s2", title: "Department Review", description: "Scheme department review.", status: "pending" },
    ],
  },
  "NSAP-2024-5432167": {
    id: "NSAP-2024-5432167",
    scheme: "National Social Assistance",
    applicant: "Mohan Lal",
    state: "Rajasthan",
    status: "rejected",
    date: "5 hours ago",
    ministry: "Ministry of Rural Development",
    fraudScore: 74,
    fraudStatus: "Flagged for review",
    riskLevel: "high",
    fraudFlags: ["Income and age declarations failed consistency review."],
    manualReviewRequired: true,
    nextAction: "Please check eligibility and reapply with updated documents.",
    eta: "Closed",
    documentsPending: [],
    steps: [
      { id: "s1", title: "Application Submitted", description: "Application was received successfully.", status: "completed", date: "Today" },
      { id: "s2", title: "Verification Review", description: "Details were reviewed.", status: "completed", date: "Today" },
      { id: "s3", title: "Final Decision", description: "Application was rejected after verification.", status: "error", date: "Today", remarks: "Eligibility mismatch found." },
    ],
  },
};

function getStatusBadge(status: string) {
  switch (status) {
    case "approved": return <Badge className="border-accent/30 bg-accent/10 text-accent"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
    case "pending": return <Badge className="border-chart-4/30 bg-chart-4/10 text-chart-4"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    case "under-review": return <Badge className="border-info/30 bg-info/10 text-info"><Activity className="mr-1 h-3 w-3" />Under Review</Badge>;
    case "rejected": return <Badge className="border-destructive/30 bg-destructive/10 text-destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
}

function getStepIcon(status: string) {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-5 w-5 text-accent" />;
    case "current": return <Clock className="h-5 w-5 text-info" />;
    case "error": return <XCircle className="h-5 w-5 text-destructive" />;
    default: return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
  }
}

export default function ApplicationReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const app = applicationDetails[id as string];

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Application not found.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold leading-tight">Full Application Review</p>
              <p className="font-mono text-xs text-muted-foreground">{app.id}</p>
            </div>
          </div>
          <div className="ml-auto">{getStatusBadge(app.status)}</div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {/* Overview */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Application Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" />Applicant</p>
              <p className="mt-1 font-semibold">{app.applicant}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />State</p>
              <p className="mt-1 font-semibold">{app.state}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" />Ministry</p>
              <p className="mt-1 font-semibold">{app.ministry}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Received</p>
              <p className="mt-1 font-semibold">{app.date}</p>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Assessment */}
        <Card className={`border-2 ${app.riskLevel === "high" ? "border-destructive/30" : app.riskLevel === "medium" ? "border-chart-4/30" : "border-accent/30"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Fraud Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fraud Status</p>
                <p className="font-semibold">{app.fraudStatus}</p>
                {app.fraudFlags.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {app.fraudFlags.map((flag: string, i: number) => (
                      <li key={i} className="text-sm text-destructive">Warning: {flag}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Risk Score</p>
                <p className={`text-4xl font-bold ${app.fraudScore >= 70 ? "text-destructive" : app.fraudScore >= 40 ? "text-chart-4" : "text-accent"}`}>
                  {app.fraudScore}
                </p>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>
            </div>
            {app.documentsPending.length > 0 && (
              <div className="mt-4 rounded-xl bg-muted/50 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Documents Pending</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {app.documentsPending.map((doc: string) => (
                    <Badge key={doc} variant="outline">{doc}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Application Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {app.steps.map((step: any, index: number) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {getStepIcon(step.status)}
                    {index < app.steps.length - 1 && (
                      <div className="mt-1 h-full w-0.5 bg-border" style={{ minHeight: "2rem" }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.date && <p className="mt-1 text-xs text-muted-foreground">{step.date}</p>}
                    {step.remarks && <p className="mt-1 text-xs text-destructive">{step.remarks}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Action */}
        <Card className="border-2">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Next Action</p>
              <p className="mt-1 font-semibold">{app.nextAction}</p>
              <p className="text-sm text-muted-foreground">ETA: {app.eta}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">Request Documents</Button>
              <Button size="sm">Approve</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
