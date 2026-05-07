"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getApplicationById, getApplications, type ApplicationRecord, type ApplicationStep } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck2,
  FileText,
  Loader2,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const trackerText = {
  en: {
    statusApproved: "Approved",
    statusPending: "Pending",
    statusUnderReview: "Under Review",
    statusRejected: "Rejected",
    statusProcessing: "Processing",
    statusUnknown: "Unknown",
    riskHigh: "High risk",
    riskWatchlist: "Watchlist",
    riskOnTrack: "On track",
    loading: "Loading applications...",
    activeApplications: "Active applications",
    approvedBenefits: "Approved benefits",
    documentsPending: "Documents pending",
    trackTitle: "Track Your Application",
    trackDescription: "Search by application ID or choose one from your recent submissions.",
    enterApplicationId: "Enter application ID",
    trackButton: "Track",
    applicationId: "Application ID:",
    state: "State:",
    eta: "ETA:",
    fraudCheck: "Fraud check:",
    national: "National",
    clean: "Clean",
    progressTitle: "Application Progress",
    currentStep: "Current Step",
    note: "Note:",
    nextActionTitle: "Next recommended action",
    docReadiness: "Document readiness",
    allDocsComplete: "All required documents are complete.",
    fraudFlags: "Fraud screening flags",
    noMatch: "No matching application found yet.",
    recentTitle: "Recent Applications",
    recentDescription: "Select one of your saved applications to inspect its current status.",
  },
  hi: {
    statusApproved: "स्वीकृत",
    statusPending: "लंबित",
    statusUnderReview: "समीक्षा में",
    statusRejected: "अस्वीकृत",
    statusProcessing: "प्रसंस्करण में",
    statusUnknown: "अज्ञात",
    riskHigh: "उच्च जोखिम",
    riskWatchlist: "वॉचलिस्ट",
    riskOnTrack: "सही मार्ग पर",
    loading: "आवेदन लोड हो रहे हैं...",
    activeApplications: "सक्रिय आवेदन",
    approvedBenefits: "स्वीकृत लाभ",
    documentsPending: "लंबित दस्तावेज़",
    trackTitle: "अपना आवेदन ट्रैक करें",
    trackDescription: "आवेदन आईडी से खोजें या अपने हाल के सबमिशन में से चुनें।",
    enterApplicationId: "आवेदन आईडी दर्ज करें",
    trackButton: "ट्रैक",
    applicationId: "आवेदन आईडी:",
    state: "राज्य:",
    eta: "अनुमानित समय:",
    fraudCheck: "फ्रॉड जांच:",
    national: "राष्ट्रीय",
    clean: "साफ",
    progressTitle: "आवेदन प्रगति",
    currentStep: "वर्तमान चरण",
    note: "नोट:",
    nextActionTitle: "अगली अनुशंसित कार्रवाई",
    docReadiness: "दस्तावेज़ तैयारी",
    allDocsComplete: "सभी आवश्यक दस्तावेज़ पूर्ण हैं।",
    fraudFlags: "फ्रॉड स्क्रीनिंग फ़्लैग",
    noMatch: "कोई मिलान आवेदन अभी नहीं मिला।",
    recentTitle: "हाल के आवेदन",
    recentDescription: "स्थिति देखने के लिए अपने सहेजे हुए आवेदन में से चुनें।",
  },
  kn: {
    statusApproved: "ಅನುಮೋದಿತ",
    statusPending: "ಬಾಕಿ",
    statusUnderReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿ",
    statusRejected: "ನಿರಾಕರಿಸಲಾಗಿದೆ",
    statusProcessing: "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ",
    statusUnknown: "ಅಜ್ಞಾತ",
    riskHigh: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    riskWatchlist: "ವಾಚ್‌ಲಿಸ್ಟ್",
    riskOnTrack: "ಸರಿಯಾದ ಹಾದಿಯಲ್ಲಿ",
    loading: "ಅರ್ಜಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    activeApplications: "ಸಕ್ರಿಯ ಅರ್ಜಿಗಳು",
    approvedBenefits: "ಅನುಮೋದಿತ ಪ್ರಯೋಜನಗಳು",
    documentsPending: "ಬಾಕಿ ದಾಖಲೆಗಳು",
    trackTitle: "ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    trackDescription: "ಅರ್ಜಿ ಐಡಿ ಮೂಲಕ ಹುಡುಕಿ ಅಥವಾ ಇತ್ತೀಚಿನ ಸಲ್ಲಿಕೆಗಳಿಂದೊಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    enterApplicationId: "ಅರ್ಜಿ ಐಡಿ ನಮೂದಿಸಿ",
    trackButton: "ಟ್ರ್ಯಾಕ್",
    applicationId: "ಅರ್ಜಿ ಐಡಿ:",
    state: "ರಾಜ್ಯ:",
    eta: "ETA:",
    fraudCheck: "ಮೋಸ ಪರಿಶೀಲನೆ:",
    national: "ರಾಷ್ಟ್ರೀಯ",
    clean: "ಸ್ವಚ್ಛ",
    progressTitle: "ಅರ್ಜಿ ಪ್ರಗತಿ",
    currentStep: "ಪ್ರಸ್ತುತ ಹಂತ",
    note: "ಸೂಚನೆ:",
    nextActionTitle: "ಮುಂದಿನ ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ",
    docReadiness: "ದಾಖಲೆ ಸಿದ್ಧತೆ",
    allDocsComplete: "ಎಲ್ಲಾ ಅಗತ್ಯ ದಾಖಲೆಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ.",
    fraudFlags: "ಮೋಸ ತಪಾಸಣೆ ಫ್ಲಾಗ್‌ಗಳು",
    noMatch: "ಹೊಂದುವ ಅರ್ಜಿ ಇನ್ನೂ ಸಿಕ್ಕಿಲ್ಲ.",
    recentTitle: "ಇತ್ತೀಚಿನ ಅರ್ಜಿಗಳು",
    recentDescription: "ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಲು ನಿಮ್ಮ ಸಂಗ್ರಹಿತ ಅರ್ಜಿಯಿಂದೊಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
  },
} as const;

const fallbackApplications: ApplicationRecord[] = [
  {
    applicationId: "SC-DEMO-1001",
    schemeId: "1",
    schemeName: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    status: "approved",
    riskLevel: "low",
    nextAction: "Bank transfer will be credited in the next cycle.",
    eta: "Completed",
    documentsPending: [],
    steps: [
      { id: "s1", title: "Application Submitted", description: "Your application has been submitted.", status: "completed", date: "March 10, 2026" },
      { id: "s2", title: "Verification Complete", description: "Documents verified.", status: "completed", date: "March 12, 2026" },
    ],
  },
];

function getStatusConfig(status: ApplicationRecord["status"], locale: Locale) {
  const text = trackerText[locale] ?? trackerText.en;
  switch (status) {
    case "approved":
      return { label: text.statusApproved, color: "bg-accent text-accent-foreground", icon: CheckCircle2 };
    case "pending":
      return { label: text.statusPending, color: "bg-chart-4 text-warning-foreground", icon: Clock };
    case "under-review":
      return { label: text.statusUnderReview, color: "bg-info text-info-foreground", icon: FileText };
    case "rejected":
      return { label: text.statusRejected, color: "bg-destructive text-destructive-foreground", icon: XCircle };
    case "processing":
      return { label: text.statusProcessing, color: "bg-primary text-primary-foreground", icon: Loader2 };
    default:
      return { label: text.statusUnknown, color: "bg-muted text-muted-foreground", icon: Circle };
  }
}

function getRiskConfig(riskLevel: ApplicationRecord["riskLevel"], locale: Locale) {
  const text = trackerText[locale] ?? trackerText.en;
  if (riskLevel === "high") return { label: text.riskHigh, color: "text-destructive", icon: ShieldAlert };
  if (riskLevel === "medium") return { label: text.riskWatchlist, color: "text-chart-4", icon: AlertTriangle };
  return { label: text.riskOnTrack, color: "text-accent", icon: FileCheck2 };
}

function StepIcon({ status }: { status: ApplicationStep["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-6 w-6 text-accent" />;
    case "current":
      return (
        <div className="relative">
          <Circle className="h-6 w-6 text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      );
    case "error":
      return <AlertTriangle className="h-6 w-6 text-destructive" />;
    default:
      return <Circle className="h-6 w-6 text-muted-foreground/40" />;
  }
}

function getUploadedDocuments(app: ApplicationRecord) {
  return Object.values(app.documents || {});
}

export function ApplicationTracker() {
  const { locale } = useLanguage();
  const text = trackerText[locale] ?? trackerText.en;
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        const token = localStorage.getItem("schemeconnect_token");
        if (!token) {
          setApplications(fallbackApplications);
          setSelectedApp(fallbackApplications[0]);
          setLoading(false);
          return;
        }

        const response = await getApplications();
        const list = response.applications.length ? response.applications : fallbackApplications;
        setApplications(list);

        const latestApplicationId = sessionStorage.getItem("latestApplicationId");
        const selected = latestApplicationId
          ? list.find((item) => item.applicationId === latestApplicationId)
          : list[0];
        setSelectedApp(selected || list[0] || null);
      } catch {
        setApplications(fallbackApplications);
        setSelectedApp(fallbackApplications[0]);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  useEffect(() => {
    if (!selectedApp || typeof window === "undefined") return;
    sessionStorage.setItem("latestApplicationId", selectedApp.applicationId);
  }, [selectedApp]);

  const summary = useMemo(() => {
    return {
      active: applications.filter((app) => app.status !== "approved").length,
      approved: applications.filter((app) => app.status === "approved").length,
      documents: applications.reduce((count, app) => count + Math.max(app.documentsPending.length, getUploadedDocuments(app).length), 0),
    };
  }, [applications]);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const token = localStorage.getItem("schemeconnect_token");
      if (token) {
        const response = await getApplicationById(searchQuery.trim());
        setSelectedApp(response.application);
        setApplications((current) => {
          const alreadyPresent = current.some((app) => app.applicationId === response.application.applicationId);
          return alreadyPresent ? current : [response.application, ...current];
        });
      } else {
        const found = applications.find((app) => app.applicationId.toLowerCase().includes(searchQuery.toLowerCase()));
        setSelectedApp(found || null);
      }
    } catch {
      setSelectedApp(null);
    } finally {
      setIsSearching(false);
    }
  }

  const selectedStatus = selectedApp ? getStatusConfig(selectedApp.status, locale) : null;
  const selectedRisk = selectedApp ? getRiskConfig(selectedApp.riskLevel, locale) : null;

  if (loading) {
    return <div className="py-10 text-center text-muted-foreground">{text.loading}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-2">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{text.activeApplications}</p>
            <p className="mt-2 text-3xl font-bold">{summary.active}</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{text.approvedBenefits}</p>
            <p className="mt-2 text-3xl font-bold text-accent">{summary.approved}</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{text.documentsPending}</p>
            <p className="mt-2 text-3xl font-bold text-chart-4">{summary.documents}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{text.trackTitle}</CardTitle>
          <CardDescription>{text.trackDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={text.enterApplicationId}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {text.trackButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedApp && selectedStatus && selectedRisk ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-2">
            <CardHeader className="border-b pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{selectedApp.schemeName}</CardTitle>
                  <CardDescription>{selectedApp.ministry}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn("w-fit", selectedStatus.color)}>{selectedStatus.label}</Badge>
                  <Badge variant="outline" className={selectedRisk.color}>
                    <selectedRisk.icon className="mr-1 h-3.5 w-3.5" />
                    {selectedRisk.label}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <span className="text-muted-foreground">{text.applicationId}</span>
                  <span className="ml-2 font-mono font-medium">{selectedApp.applicationId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{text.state}</span>
                  <span className="ml-2 font-medium">{selectedApp.state || text.national}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{text.eta}</span>
                  <span className="ml-2 font-medium">{selectedApp.eta}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{text.fraudCheck}</span>
                  <span className="ml-2 font-medium">{selectedApp.fraudStatus || text.clean}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="mb-6 font-semibold">{text.progressTitle}</h3>
              <div className="relative">
                {selectedApp.steps.map((step, index) => (
                  <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {index < selectedApp.steps.length - 1 && (
                      <div
                        className={cn(
                          "absolute left-3 top-6 h-full w-px",
                          step.status === "completed" ? "bg-accent" : "bg-border",
                        )}
                      />
                    )}
                    <StepIcon status={step.status} />
                    <div className="flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={cn("font-medium", step.status === "pending" && "text-muted-foreground")}>{step.title}</h4>
                        {step.status === "current" ? (
                          <Badge variant="secondary" className="text-xs">
                            {text.currentStep}
                          </Badge>
                        ) : null}
                      </div>
                      <p className={cn("mt-1 text-sm", step.status === "pending" ? "text-muted-foreground/60" : "text-muted-foreground")}>
                        {step.description}
                      </p>
                      {step.date ? <p className="mt-1 text-xs text-muted-foreground">{step.date}</p> : null}
                      {step.remarks ? (
                        <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                          <span className="font-medium">{text.note}</span> {step.remarks}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">{text.nextActionTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-foreground/85">{selectedApp.nextAction}</p>
              </CardContent>
            </Card>

              <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">{text.docReadiness}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getUploadedDocuments(selectedApp).length ? (
                  getUploadedDocuments(selectedApp).map((document) => (
                    <div key={`${document.fieldId}-${document.filename}`} className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                      <FileCheck2 className="h-4 w-4 text-accent" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{document.label || document.fieldId}</p>
                        <p className="truncate text-xs text-muted-foreground">{document.originalName}</p>
                      </div>
                    </div>
                  ))
                ) : null}
                {selectedApp.documentsPending.length ? (
                  selectedApp.documentsPending.map((document) => (
                    <div key={document} className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                      <AlertTriangle className="h-4 w-4 text-chart-4" />
                      <span className="text-sm">{document}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border bg-accent/10 px-4 py-3 text-accent">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{text.allDocsComplete}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {((selectedApp.fraudScore ?? 0) >= 70 || selectedApp.manualReviewRequired) ? (
              <Card className="border-2 border-red-300 bg-red-50">
                <CardContent className="flex items-start gap-3 p-4">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-700">Application Flagged for Review</p>
                    <p className="mt-0.5 text-sm text-red-600">
                      Our system has flagged this application for manual review. This does not mean your application is rejected — a government official will verify your details. No action is needed from your side.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {selectedApp.fraudFlags?.length ? (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{text.fraudFlags}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedApp.fraudFlags.map((flag) => (
                    <div key={flag} className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                      <ShieldAlert className="h-4 w-4 text-chart-4" />
                      <span className="text-sm">{flag}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            {text.noMatch}
          </CardContent>
        </Card>
      )}

      <Card className="border-2">
        <CardHeader>
          <CardTitle>{text.recentTitle}</CardTitle>
          <CardDescription>{text.recentDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {applications.map((app) => {
              const statusConfig = getStatusConfig(app.status, locale);
              const StatusIcon = statusConfig.icon;
              return (
                <button
                  key={app.applicationId}
                  onClick={() => {
                    setSearchQuery(app.applicationId);
                    setSelectedApp(app);
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", statusConfig.color)}>
                    <StatusIcon className={cn("h-5 w-5", app.status === "processing" && "animate-spin")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{app.schemeName}</p>
                    <p className="truncate text-sm text-muted-foreground">{app.applicationId}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium">{app.eta}</p>
                    <p className="text-xs text-muted-foreground">{app.nextAction}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
