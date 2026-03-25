"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Loader2,
  Search,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "error";
  date?: string;
  remarks?: string;
}

interface Application {
  id: string;
  applicationId: string;
  schemeName: string;
  ministry: string;
  submittedDate: string;
  status: "approved" | "pending" | "under-review" | "rejected" | "processing";
  currentStep: number;
  steps: ApplicationStep[];
}

const mockApplications: Application[] = [
  {
    id: "1",
    applicationId: "PM-KISAN-2024-1234567",
    schemeName: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    submittedDate: "January 15, 2026",
    status: "approved",
    currentStep: 4,
    steps: [
      {
        id: "s1",
        title: "Application Submitted",
        description: "Your application has been successfully submitted",
        status: "completed",
        date: "January 15, 2026",
      },
      {
        id: "s2",
        title: "Document Verification",
        description: "Documents verified by local authority",
        status: "completed",
        date: "January 20, 2026",
      },
      {
        id: "s3",
        title: "Field Verification",
        description: "Physical verification completed by field officer",
        status: "completed",
        date: "January 28, 2026",
      },
      {
        id: "s4",
        title: "Final Approval",
        description: "Application approved by competent authority",
        status: "completed",
        date: "February 5, 2026",
        remarks: "Benefit will be credited to your account shortly",
      },
    ],
  },
  {
    id: "2",
    applicationId: "PMAY-G-2024-9876543",
    schemeName: "PM Awas Yojana - Gramin",
    ministry: "Ministry of Rural Development",
    submittedDate: "February 1, 2026",
    status: "under-review",
    currentStep: 2,
    steps: [
      {
        id: "s1",
        title: "Application Submitted",
        description: "Your application has been successfully submitted",
        status: "completed",
        date: "February 1, 2026",
      },
      {
        id: "s2",
        title: "Document Verification",
        description: "Documents are being reviewed",
        status: "current",
        remarks: "Awaiting income certificate verification",
      },
      {
        id: "s3",
        title: "Socio-Economic Survey",
        description: "SECC data verification pending",
        status: "pending",
      },
      {
        id: "s4",
        title: "Gram Sabha Approval",
        description: "Approval from Gram Sabha pending",
        status: "pending",
      },
      {
        id: "s5",
        title: "Final Sanction",
        description: "Awaiting final sanction",
        status: "pending",
      },
    ],
  },
  {
    id: "3",
    applicationId: "UJJWALA-2024-5551234",
    schemeName: "PM Ujjwala Yojana",
    ministry: "Ministry of Petroleum",
    submittedDate: "December 10, 2025",
    status: "processing",
    currentStep: 3,
    steps: [
      {
        id: "s1",
        title: "Application Submitted",
        description: "Application submitted at LPG distributor",
        status: "completed",
        date: "December 10, 2025",
      },
      {
        id: "s2",
        title: "KYC Verification",
        description: "Know Your Customer verification completed",
        status: "completed",
        date: "December 15, 2025",
      },
      {
        id: "s3",
        title: "Connection Approval",
        description: "LPG connection approved, awaiting installation",
        status: "current",
        remarks: "Installation scheduled for March 28, 2026",
      },
      {
        id: "s4",
        title: "Connection Delivered",
        description: "LPG connection and first cylinder delivered",
        status: "pending",
      },
    ],
  },
];

function getStatusConfig(status: Application["status"]) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        color: "bg-accent text-accent-foreground",
        icon: CheckCircle2,
      };
    case "pending":
      return {
        label: "Pending",
        color: "bg-chart-4 text-warning-foreground",
        icon: Clock,
      };
    case "under-review":
      return {
        label: "Under Review",
        color: "bg-info text-info-foreground",
        icon: FileText,
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "bg-destructive text-destructive-foreground",
        icon: XCircle,
      };
    case "processing":
      return {
        label: "Processing",
        color: "bg-primary text-primary-foreground",
        icon: Loader2,
      };
    default:
      return {
        label: "Unknown",
        color: "bg-muted text-muted-foreground",
        icon: Circle,
      };
  }
}

function StepIcon({
  status,
  className,
}: {
  status: ApplicationStep["status"];
  className?: string;
}) {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2
          className={cn("h-6 w-6 text-accent", className)}
        />
      );
    case "current":
      return (
        <div className={cn("relative", className)}>
          <Circle className="h-6 w-6 text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      );
    case "error":
      return (
        <AlertTriangle
          className={cn("h-6 w-6 text-destructive", className)}
        />
      );
    default:
      return (
        <Circle className={cn("h-6 w-6 text-muted-foreground/40", className)} />
      );
  }
}

export function ApplicationTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const found = mockApplications.find(
      (app) =>
        app.applicationId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSelectedApp(found || null);
    setIsSearching(false);
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Track Your Application</CardTitle>
          <CardDescription>
            Enter your application ID to check the current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter Application ID (e.g., PM-KISAN-2024-1234567)"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Track
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Try: PM-KISAN-2024-1234567, PMAY-G-2024-9876543, or UJJWALA-2024-5551234
          </p>
        </CardContent>
      </Card>

      {/* Application Details */}
      {selectedApp && (
        <Card>
          <CardHeader className="border-b pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{selectedApp.schemeName}</CardTitle>
                <CardDescription>{selectedApp.ministry}</CardDescription>
              </div>
              <Badge className={cn("w-fit", getStatusConfig(selectedApp.status).color)}>
                {getStatusConfig(selectedApp.status).label}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Application ID:</span>
                <span className="ml-2 font-mono font-medium">
                  {selectedApp.applicationId}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <span className="ml-2 font-medium">{selectedApp.submittedDate}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="mb-6 font-semibold">Application Progress</h3>
            <div className="relative">
              {selectedApp.steps.map((step, index) => (
                <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Connector line */}
                  {index < selectedApp.steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-3 top-6 h-full w-px",
                        step.status === "completed" ? "bg-accent" : "bg-border"
                      )}
                    />
                  )}
                  {/* Step icon */}
                  <StepIcon status={step.status} />
                  {/* Step content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={cn(
                          "font-medium",
                          step.status === "pending" && "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </h4>
                      {step.status === "current" && (
                        <Badge variant="secondary" className="text-xs">
                          Current Step
                        </Badge>
                      )}
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        step.status === "pending"
                          ? "text-muted-foreground/60"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.description}
                    </p>
                    {step.date && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {step.date}
                      </p>
                    )}
                    {step.remarks && (
                      <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                        <span className="font-medium">Note:</span> {step.remarks}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your recently tracked applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockApplications.map((app) => {
              const statusConfig = getStatusConfig(app.status);
              const StatusIcon = statusConfig.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    setSearchQuery(app.applicationId);
                    setSelectedApp(app);
                  }}
                  className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      statusConfig.color
                    )}
                  >
                    <StatusIcon className={cn("h-5 w-5", app.status === "processing" && "animate-spin")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{app.schemeName}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {app.applicationId}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <Badge
                      variant="outline"
                      className="mb-1"
                    >
                      {statusConfig.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {app.submittedDate}
                    </p>
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
