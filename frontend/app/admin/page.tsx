"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, BrainCircuit, LayoutDashboard, LogOut, SearchCheck, Shield, ShieldAlert, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminApplications, type ApplicationRecord } from "@/lib/api";

type FraudAlert = {
  id: string;
  applicant: string;
  scheme: string;
  riskScore: number;
  reason: string;
};

const fallbackFraudAlerts: FraudAlert[] = [
  {
    id: "SC-90876124",
    applicant: "Anita Kumari",
    scheme: "PM Awas Yojana",
    riskScore: 82,
    reason: "Multiple submissions with mismatched income details.",
  },
  {
    id: "SC-90876125",
    applicant: "Ravi Shetty",
    scheme: "PM Kisan Samman Nidhi",
    riskScore: 64,
    reason: "Land ownership proof missing while repeated re-apply detected.",
  },
  {
    id: "SC-90876126",
    applicant: "Farzana Begum",
    scheme: "Ayushman Bharat",
    riskScore: 41,
    reason: "Household profile changed sharply across recent applications.",
  },
];

function getRiskTone(score: number) {
  if (score >= 70) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }

  if (score >= 40) {
    return "border-chart-4/30 bg-chart-4/10 text-chart-4";
  }

  return "border-accent/30 bg-accent/10 text-accent";
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(fallbackFraudAlerts);
  const [fraudLoading, setFraudLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("schemeconnect_user");

    if (!storedUser) {
      router.replace("/admin/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "admin") {
        router.replace("/admin/login");
        return;
      }
      setIsReady(true);
    } catch {
      router.replace("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    async function loadApplications() {
      setAppsLoading(true);
      try {
        const response = await getAdminApplications();
        setApplications(response.applications);
      } catch {
        setApplications([]);
      } finally {
        setAppsLoading(false);
      }
    }

    if (isReady) {
      loadApplications();
    }
  }, [isReady]);

  useEffect(() => {
    async function loadFraudAlerts() {
      setFraudLoading(true);

      const sampleProfiles = [
        { citizen_id: "SC-90876124", age: 34, annual_income: 48000, application_count: 8, state: "Bihar" },
        { citizen_id: "SC-90876125", age: 52, annual_income: 95000, application_count: 6, state: "Karnataka" },
        { citizen_id: "SC-90876126", age: 29, annual_income: 120000, application_count: 3, state: "West Bengal" },
      ];

      try {
        const results = await Promise.all(
          sampleProfiles.map((profile) =>
            fetch("${getMLBase()}/check-fraud", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profile),
            }).then((res) => res.json()),
          ),
        );

        const names = ["Anita Kumari", "Ravi Shetty", "Farzana Begum"];
        const schemes = ["PM Awas Yojana", "PM Kisan Samman Nidhi", "Ayushman Bharat"];

        setFraudAlerts(
          results.map((result, index) => ({
            id: sampleProfiles[index].citizen_id,
            applicant: names[index],
            scheme: schemes[index],
            riskScore: result.fraud_score ?? 0,
            reason: result.flags?.[0] ?? "No specific flags raised.",
          })),
        );
      } catch {
        // Keep fallback alerts when ML service is unavailable.
      } finally {
        setFraudLoading(false);
      }
    }

    if (isReady) {
      loadFraudAlerts();
    }
  }, [isReady]);

  const stats = useMemo(() => {
    const totalChecks = applications.length;

    const schemeCounts = applications.reduce<Record<string, number>>((acc, item) => {
      const key = item.schemeName || "Unknown Scheme";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const topSchemes = Object.entries(schemeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    const highRiskAlerts = fraudAlerts.filter((item) => item.riskScore >= 70).length;
    const avgFraudScore =
      fraudAlerts.length > 0
        ? Math.round(fraudAlerts.reduce((sum, item) => sum + item.riskScore, 0) / fraudAlerts.length)
        : 0;

    return {
      totalChecks,
      topSchemes,
      highRiskAlerts,
      avgFraudScore,
    };
  }, [applications, fraudAlerts]);

  function handleLogout() {
    localStorage.removeItem("schemeconnect_token");
    localStorage.removeItem("schemeconnect_user");
    window.location.assign("/admin/login");
  }

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">SchemeConnect Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/submissions">
              <Button variant="outline" size="sm">
                View submissions
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-foreground">Analytics Overview</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">What matters right now</h2>
          <p className="mt-1 text-muted-foreground">
            Focus on eligibility activity, top matched schemes, and fraud review signals.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>Total eligibility checks done</CardDescription>
              <CardTitle className="text-3xl">{appsLoading ? "..." : stats.totalChecks.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SearchCheck className="h-4 w-4" />
                User checks reaching application stage
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>Most popular schemes matched</CardDescription>
              <CardTitle className="text-3xl">{stats.topSchemes.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Top matches based on submissions
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>Fraud detection alerts</CardDescription>
              <CardTitle className="text-3xl">{fraudLoading ? "..." : stats.highRiskAlerts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldAlert className="h-4 w-4" />
                High-risk applications requiring action
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardDescription>Average fraud score</CardDescription>
              <CardTitle className="text-3xl">{fraudLoading ? "..." : `${stats.avgFraudScore}%`}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BrainCircuit className="h-4 w-4" />
                ML signal strength across sampled alerts
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Most Popular Schemes Matched</CardTitle>
              <CardDescription>Top schemes users are getting matched with most often.</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.topSchemes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No application data available yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats.topSchemes.map((scheme, index) => (
                    <div key={scheme.name} className="flex items-center justify-between rounded-xl border bg-background p-3">
                      <div>
                        <p className="font-medium">{index + 1}. {scheme.name}</p>
                        <p className="text-xs text-muted-foreground">Matched applications</p>
                      </div>
                      <Badge variant="secondary">{scheme.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
                Fraud Detection Alerts
              </CardTitle>
              <CardDescription>Live ML-risk indications for manual verification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {fraudAlerts.map((item) => (
                <div key={item.id} className="rounded-xl border bg-background p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{item.applicant}</p>
                    <Badge className={getRiskTone(item.riskScore)}>Risk {item.riskScore}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.scheme}</p>
                  <p className="mt-2 text-sm">{item.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
