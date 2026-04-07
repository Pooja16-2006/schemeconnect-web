"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getApplicationById, getApplications, type ApplicationRecord, type ApplicationStep } from "@/lib/api";
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

function getStatusConfig(status: ApplicationRecord["status"]) {
  switch (status) {
    case "approved":
      return { label: "Approved", color: "bg-accent text-accent-foreground", icon: CheckCircle2 };
    case "pending":
      return { label: "Pending", color: "bg-chart-4 text-warning-foreground", icon: Clock };
    case "under-review":
      return { label: "Under Review", color: "bg-info text-info-foreground", icon: FileText };
    case "rejected":
      return { label: "Rejected", color: "bg-destructive text-destructive-foreground", icon: XCircle };
    case "processing":
      return { label: "Processing", color: "bg-primary text-primary-foreground", icon: Loader2 };
    default:
      return { label: "Unknown", color: "bg-muted text-muted-foreground", icon: Circle };
  }
}

function getRiskConfig(riskLevel: ApplicationRecord["riskLevel"]) {
  if (riskLevel === "high") return { label: "High risk", color: "text-destructive", icon: ShieldAlert };
  if (riskLevel === "medium") return { label: "Watchlist", color: "text-chart-4", icon: AlertTriangle };
  return { label: "On track", color: "text-accent", icon: FileCheck2 };
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

export function ApplicationTracker() {
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
      documents: applications.reduce((count, app) => count + app.documentsPending.length, 0),
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

  const selectedStatus = selectedApp ? getStatusConfig(selectedApp.status) : null;
  const selectedRisk = selectedApp ? getRiskConfig(selectedApp.riskLevel) : null;

  if (loading) {
    return <div className="py-10 text-center text-muted-foreground">Loading applications...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-2">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active applications</p>
            <p className="mt-2 text-3xl font-bold">{summary.active}</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Approved benefits</p>
            <p className="mt-2 text-3xl font-bold text-accent">{summary.approved}</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Documents pending</p>
            <p className="mt-2 text-3xl font-bold text-chart-4">{summary.documents}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Track Your Application</CardTitle>
          <CardDescription>Search by application ID or choose one from your recent submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter application ID"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Track
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
                  <span className="text-muted-foreground">Application ID:</span>
                  <span className="ml-2 font-mono font-medium">{selectedApp.applicationId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">State:</span>
                  <span className="ml-2 font-medium">{selectedApp.state || "National"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ETA:</span>
                  <span className="ml-2 font-medium">{selectedApp.eta}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fraud check:</span>
                  <span className="ml-2 font-medium">{selectedApp.fraudStatus || "Clean"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="mb-6 font-semibold">Application Progress</h3>
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
                            Current Step
                          </Badge>
                        ) : null}
                      </div>
                      <p className={cn("mt-1 text-sm", step.status === "pending" ? "text-muted-foreground/60" : "text-muted-foreground")}>
                        {step.description}
                      </p>
                      {step.date ? <p className="mt-1 text-xs text-muted-foreground">{step.date}</p> : null}
                      {step.remarks ? (
                        <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                          <span className="font-medium">Note:</span> {step.remarks}
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
                <CardTitle className="text-lg">Next recommended action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-foreground/85">{selectedApp.nextAction}</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Document readiness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                    <span className="text-sm font-medium">All required documents are complete.</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedApp.fraudFlags?.length ? (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Fraud screening flags</CardTitle>
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
            No matching application found yet.
          </CardContent>
        </Card>
      )}

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Select one of your saved applications to inspect its current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {applications.map((app) => {
              const statusConfig = getStatusConfig(app.status);
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
