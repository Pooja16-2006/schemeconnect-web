"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Settings,
  Shield,
  TrendingUp,
  Users,
  XCircle,
  Activity,
  BarChart3,
  Calendar,
  BrainCircuit,
  FileWarning,
  LogOut,
  MapPinned,
  SearchCheck,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { getAdminApplications, type ApplicationRecord } from "@/lib/api";
import { cn } from "@/lib/utils";

// Analytics data
const applicationTrends = [
  { month: "Jan", applications: 12500, approved: 9800, rejected: 1200 },
  { month: "Feb", applications: 14200, approved: 11200, rejected: 1400 },
  { month: "Mar", applications: 15800, approved: 12600, rejected: 1600 },
  { month: "Apr", applications: 18200, approved: 14800, rejected: 1800 },
  { month: "May", applications: 21500, approved: 17400, rejected: 2100 },
  { month: "Jun", applications: 24800, approved: 20200, rejected: 2400 },
];

const schemeCategoryData = [
  { category: "Agriculture", applications: 35000, color: "#1e4b8e" },
  { category: "Healthcare", applications: 28000, color: "#2d8659" },
  { category: "Education", applications: 22000, color: "#3498db" },
  { category: "Housing", applications: 18000, color: "#e67e22" },
  { category: "Employment", applications: 15000, color: "#9b59b6" },
  { category: "Social Security", applications: 12000, color: "#1abc9c" },
];

const stateWiseData = [
  { state: "UP", applications: 45000 },
  { state: "Bihar", applications: 38000 },
  { state: "MP", applications: 32000 },
  { state: "Rajasthan", applications: 28000 },
  { state: "Maharashtra", applications: 25000 },
  { state: "Gujarat", applications: 22000 },
  { state: "Karnataka", applications: 18000 },
  { state: "Tamil Nadu", applications: 16000 },
];

const disbursementData = [
  { month: "Jan", amount: 2500 },
  { month: "Feb", amount: 3200 },
  { month: "Mar", amount: 2800 },
  { month: "Apr", amount: 4100 },
  { month: "May", amount: 4800 },
  { month: "Jun", amount: 5200 },
];

const schemePerformanceData = [
  { scheme: "PM Kisan", applications: 18200, approved: 14850, rejected: 1320 },
  { scheme: "Ayushman", applications: 16500, approved: 13940, rejected: 910 },
  { scheme: "PM Awas", applications: 14100, approved: 10180, rejected: 1720 },
  { scheme: "MGNREGA", applications: 12850, approved: 9440, rejected: 1840 },
  { scheme: "Scholarship", applications: 9600, approved: 7420, rejected: 980 },
  { scheme: "Mudra", applications: 8350, approved: 6110, rejected: 890 },
];

const schemeApprovalRateData = [
  { month: "Jan", "PM Kisan": 79, "Ayushman": 82, "PM Awas": 68 },
  { month: "Feb", "PM Kisan": 81, "Ayushman": 83, "PM Awas": 69 },
  { month: "Mar", "PM Kisan": 82, "Ayushman": 84, "PM Awas": 71 },
  { month: "Apr", "PM Kisan": 81, "Ayushman": 85, "PM Awas": 72 },
  { month: "May", "PM Kisan": 83, "Ayushman": 84, "PM Awas": 73 },
  { month: "Jun", "PM Kisan": 82, "Ayushman": 85, "PM Awas": 72 },
];

const statsCards = [
  {
    title: "Profiles Screened",
    value: "1.25M",
    change: "+12.5%",
    trend: "up",
    icon: BrainCircuit,
    description: "citizens screened this month",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Eligible Citizens",
    value: "8.5L",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "recommended for at least one scheme",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    title: "Recommendation Precision",
    value: "82.3%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle2,
    description: "approved after recommendation",
    gradient: "from-info/20 to-info/5",
  },
  {
    title: "Office Visits Saved",
    value: "2.45L",
    change: "+18.7%",
    trend: "up",
    icon: FileText,
    description: "estimated in-person enquiries avoided",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
];

const insightCards = [
  {
    title: "Top bottleneck",
    value: "Income certificate mismatch",
    description: "31% of delayed applications are stuck at document verification.",
    icon: Siren,
  },
  {
    title: "Highest demand cluster",
    value: "UP + Bihar",
    description: "Housing and health schemes dominate new citizen searches.",
    icon: MapPinned,
  },
];

const fraudQueue = [
  {
    id: "SC-90876124",
    applicant: "Anita Kumari",
    scheme: "PM Awas Yojana",
    riskScore: 82,
    state: "Bihar",
    reason: "Multiple submissions with mismatched income details.",
    action: "Request income proof",
  },
  {
    id: "SC-90876125",
    applicant: "Ravi Shetty",
    scheme: "PM Kisan Samman Nidhi",
    riskScore: 64,
    state: "Karnataka",
    reason: "Land ownership proof missing while repeated re-apply detected.",
    action: "Manual land verification",
  },
  {
    id: "SC-90876126",
    applicant: "Farzana Begum",
    scheme: "Ayushman Bharat",
    riskScore: 41,
    state: "West Bengal",
    reason: "Household profile changed sharply across recent applications.",
    action: "Call centre outreach",
  },
];

const workflowActions = [
  {
    title: "Review flagged cases",
    description: "Prioritize citizens whose applications were routed into fraud review.",
    icon: ShieldAlert,
    cta: "Open review queue",
  },
  {
    title: "Audit recommendation quality",
    description: "Check whether high-confidence matches are converting into approved benefits.",
    icon: SearchCheck,
    cta: "Inspect model outcomes",
  },
  {
    title: "Export pending workload",
    description: "Share pending manual verification items with district teams.",
    icon: FileWarning,
    cta: "Prepare export",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="border-accent/30 bg-accent/10 text-accent">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge className="border-chart-4/30 bg-chart-4/10 text-chart-4">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "under-review":
      return (
        <Badge className="border-info/30 bg-info/10 text-info">
          <Activity className="mr-1 h-3 w-3" />
          Under Review
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="border-destructive/30 bg-destructive/10 text-destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getRiskBadge(score: number) {
  if (score >= 70) {
    return <Badge className="border-destructive/30 bg-destructive/10 text-destructive">High risk</Badge>;
  }
  if (score >= 40) {
    return <Badge className="border-chart-4/30 bg-chart-4/10 text-chart-4">Watchlist</Badge>;
  }
  return <Badge className="border-accent/30 bg-accent/10 text-accent">Low risk</Badge>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState("6months");
  const [isReady, setIsReady] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [liveFraudQueue, setLiveFraudQueue] = useState(fraudQueue);
  const [fraudLoading, setFraudLoading] = useState(false);
  const [recentApplications, setRecentApplications] = useState<ApplicationRecord[]>([]);
  const [recentApplicationsLoading, setRecentApplicationsLoading] = useState(false);
  const [selectedRecentApplication, setSelectedRecentApplication] = useState<ApplicationRecord | null>(null);

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
    async function fetchFraudData() {
      setFraudLoading(true);
      const sampleProfiles = [
        { citizen_id: "SC-90876124", age: 34, annual_income: 48000, application_count: 8, state: "Bihar" },
        { citizen_id: "SC-90876125", age: 52, annual_income: 95000, application_count: 6, state: "Karnataka" },
        { citizen_id: "SC-90876126", age: 29, annual_income: 120000, application_count: 3, state: "West Bengal" },
      ];

      try {
        const results = await Promise.all(
          sampleProfiles.map((profile) =>
            fetch("http://localhost:8001/check-fraud", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profile),
            }).then((res) => res.json()),
          ),
        );

        const names = ["Anita Kumari", "Ravi Shetty", "Farzana Begum"];
        const schemes = ["PM Awas Yojana", "PM Kisan Samman Nidhi", "Ayushman Bharat"];
        const states = ["Bihar", "Karnataka", "West Bengal"];
        const actions = ["Request income proof", "Manual land verification", "Call centre outreach"];

        const mapped = results.map((result, i) => ({
          id: sampleProfiles[i].citizen_id,
          applicant: names[i],
          scheme: schemes[i],
          riskScore: result.fraud_score ?? 0,
          state: states[i],
          reason: result.flags?.[0] ?? "No specific flags raised.",
          action: actions[i],
        }));

        setLiveFraudQueue(mapped);
      } catch {
        // Keep the existing hardcoded queue if the ML service is unreachable.
      } finally {
        setFraudLoading(false);
      }
    }

    fetchFraudData();
  }, []);

  useEffect(() => {
    async function fetchRecentApplications() {
      setRecentApplicationsLoading(true);
      try {
        const data = await getAdminApplications();
        setRecentApplications(data.applications);
      } catch {
        setRecentApplications([]);
      } finally {
        setRecentApplicationsLoading(false);
      }
    }

    if (isReady) {
      fetchRecentApplications();
    }
  }, [isReady]);

  function handleLogout() {
    localStorage.removeItem("schemeconnect_token");
    localStorage.removeItem("schemeconnect_user");
    window.location.assign("/admin/login");
  }

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading admin dashboard...</div>;
  }

  const filteredFraudQueue = liveFraudQueue.filter((item) => {
    if (reviewFilter === "high") return item.riskScore >= 70;
    if (reviewFilter === "watchlist") return item.riskScore >= 40 && item.riskScore < 70;
    return true;
  });
  const visibleApplications = showAllApplications ? recentApplications : recentApplications.slice(0, 4);

  function formatRelativeTime(createdAt?: string) {
    if (!createdAt) return "Unknown";

    const diffMinutes = Math.max(1, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">SchemeConnect Analytics</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-[180px]">
              <NativeSelect
                aria-label="Select time period"
                className="h-10 pl-9 shadow-sm"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
              </NativeSelect>
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Link href="/admin/submissions">
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                View Citizen Submissions
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-foreground">Analytics Overview</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, Administrator
          </h2>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening across eligibility screening, application progress, and benefit delivery.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="group relative overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100", stat.gradient)} />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                      stat.trend === "up" 
                        ? "bg-accent/10 text-accent" 
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {insightCards.map((insight) => (
            <Card key={insight.title} className="border-2">
              <CardContent className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="mt-2 text-2xl font-bold">{insight.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{insight.description}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <insight.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    Fraud Review Queue
                    {fraudLoading && <span className="text-xs font-normal text-muted-foreground">(loading live data...)</span>}
                  </CardTitle>
                  <CardDescription>Applications that need manual intervention before approval can continue.</CardDescription>
                </div>
                <div className="relative w-[170px]">
                  <NativeSelect value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} className="h-10 shadow-sm">
                    <option value="all">All cases</option>
                    <option value="high">High risk only</option>
                    <option value="watchlist">Watchlist only</option>
                  </NativeSelect>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFraudQueue.map((item) => (
                <div key={item.id} className="rounded-2xl border bg-background p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{item.applicant}</p>
                        {getRiskBadge(item.riskScore)}
                        <Badge variant="outline">{item.state}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.scheme}</p>
                      <p className="text-sm">{item.reason}</p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Risk score</p>
                      <p className="text-2xl font-bold">{item.riskScore}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Next action</p>
                      <p className="text-sm font-medium">{item.action}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Request Docs</Button>
                      <Button size="sm">Assign Review</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchCheck className="h-5 w-5 text-primary" />
                Operations Center
              </CardTitle>
              <CardDescription>Common actions for administrators after login.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflowActions.map((item) => (
                <div key={item.title} className="rounded-2xl border bg-background p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      <Button variant="ghost" size="sm" className="mt-3 px-0 text-primary">
                        {item.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
                <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/70">Today&apos;s admin target</p>
                <p className="mt-2 text-2xl font-bold">Resolve 18 flagged applications</p>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  Clearing the current queue can reduce average approval delay by an estimated 11%.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Application Trends */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Application Trends
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Monthly applications, approvals, and rejections
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-normal">
                  <Activity className="mr-1 h-3 w-3" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  applications: {
                    label: "Applications",
                    color: "#1e4b8e",
                  },
                  approved: {
                    label: "Approved",
                    color: "#2d8659",
                  },
                  rejected: {
                    label: "Rejected",
                    color: "#dc2626",
                  },
                }}
                className="h-[300px]"
              >
                <LineChart data={applicationTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#1e4b8e"
                    strokeWidth={3}
                    dot={{ fill: "#1e4b8e", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Profiles Screened"
                  />
                  <Line
                    type="monotone"
                    dataKey="approved"
                    stroke="#2d8659"
                    strokeWidth={3}
                    dot={{ fill: "#2d8659", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Eligible & Approved"
                  />
                  <Line
                    type="monotone"
                    dataKey="rejected"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Rejected or Incomplete"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Scheme Categories */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Applications by Category
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Which scheme families are receiving the most citizen demand
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  applications: {
                    label: "Applications",
                  },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={schemeCategoryData}
                    dataKey="applications"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ category, percent }) =>
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {schemeCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* State-wise Applications */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                State-wise Applications
              </CardTitle>
              <CardDescription>Top 8 states by application volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  applications: {
                    label: "Applications",
                    color: "#1e4b8e",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={stateWiseData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="state" type="category" className="text-xs" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="applications" 
                    fill="#1e4b8e" 
                    radius={[0, 8, 8, 0]} 
                    name="Applications"
                    barSize={24}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Disbursement Trend */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Benefit Value Delivered
              </CardTitle>
              <CardDescription>Monthly estimated value delivered in Crores (INR)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  amount: {
                    label: "Amount (Cr)",
                    color: "#2d8659",
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart data={disbursementData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d8659" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2d8659" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#2d8659"
                    fill="url(#colorAmount)"
                    strokeWidth={3}
                    name="Amount (Cr)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Scheme Performance Snapshot
              </CardTitle>
              <CardDescription>Applications, approvals, and rejections for each major scheme.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  applications: { label: "Applications", color: "#1e4b8e" },
                  approved: { label: "Approved", color: "#2d8659" },
                  rejected: { label: "Rejected", color: "#dc2626" },
                }}
                className="h-[340px] overflow-hidden"
              >
                <BarChart data={schemePerformanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="scheme" className="text-xs" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis className="text-xs" width={50} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="applications" fill="#1e4b8e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="approved" fill="#2d8659" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="rejected" fill="#dc2626" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Scheme Approval Rate Trends
              </CardTitle>
              <CardDescription>Monthly approval-rate movement for the highest-volume schemes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "PM Kisan": { label: "PM Kisan", color: "#1e4b8e" },
                  Ayushman: { label: "Ayushman", color: "#2d8659" },
                  "PM Awas": { label: "PM Awas", color: "#e67e22" },
                }}
                className="h-[340px]"
              >
                <LineChart data={schemeApprovalRateData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" domain={[60, 90]} width={40} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="PM Kisan" stroke="#1e4b8e" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Ayushman" stroke="#2d8659" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="PM Awas" stroke="#e67e22" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="mt-6 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  {recentApplicationsLoading ? "Loading live submissions..." : "Latest applications across all schemes"}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllApplications((current) => !current)}
                disabled={recentApplications.length === 0}
              >
                {showAllApplications ? "Show Less" : "View All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentApplicationsLoading ? (
              <div className="py-12 text-center text-muted-foreground">Loading recent applications...</div>
            ) : visibleApplications.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No citizen applications have been submitted yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-4 font-semibold">Application ID</th>
                      <th className="pb-4 font-semibold">Scheme</th>
                      <th className="hidden pb-4 font-semibold sm:table-cell">Applicant</th>
                      <th className="hidden pb-4 font-semibold md:table-cell">State</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="hidden pb-4 text-right font-semibold sm:table-cell">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleApplications.map((app, index) => (
                      <tr
                        key={app.applicationId}
                        onClick={() => setSelectedRecentApplication(app)}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/50",
                          index !== visibleApplications.length - 1 && "border-b",
                          selectedRecentApplication?.applicationId === app.applicationId && "bg-muted/40",
                        )}
                      >
                        <td className="py-4">
                          <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
                            {app.applicationId}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="font-medium">{app.schemeName}</span>
                        </td>
                        <td className="hidden py-4 sm:table-cell">
                          <span className="text-muted-foreground">{app.citizenName || "-"}</span>
                        </td>
                        <td className="hidden py-4 md:table-cell">
                          <span className="text-muted-foreground">{app.state || "-"}</span>
                        </td>
                        <td className="py-4">{getStatusBadge(app.status)}</td>
                        <td className="hidden py-4 text-right text-sm text-muted-foreground sm:table-cell">
                          {formatRelativeTime(app.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedRecentApplication ? (
              <div className="mt-6 rounded-2xl border bg-muted/20 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Application Details</p>
                    <h3 className="text-xl font-semibold">{selectedRecentApplication.schemeName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRecentApplication.applicationId}</p>
                  </div>
                  {getStatusBadge(selectedRecentApplication.status)}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Applicant</p>
                    <p className="mt-1 font-medium">{selectedRecentApplication.citizenName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">State</p>
                    <p className="mt-1 font-medium">{selectedRecentApplication.state || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Received</p>
                    <p className="mt-1 font-medium">{formatRelativeTime(selectedRecentApplication.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button size="sm" onClick={() => router.push("/admin/submissions")}>
                    Open Full Review
                  </Button>
                  <Button variant="outline" size="sm">Request Documents</Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedRecentApplication(null)}>Close</Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
