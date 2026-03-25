"use client";

import { useState } from "react";
import Link from "next/link";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
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

const recentApplications = [
  {
    id: "PM-KISAN-2024-8765432",
    scheme: "PM Kisan Samman Nidhi",
    applicant: "Ramesh Kumar",
    state: "Uttar Pradesh",
    status: "approved",
    date: "2 hours ago",
  },
  {
    id: "PMAY-G-2024-1234567",
    scheme: "PM Awas Yojana",
    applicant: "Sunita Devi",
    state: "Bihar",
    status: "pending",
    date: "3 hours ago",
  },
  {
    id: "UJJWALA-2024-9876543",
    scheme: "PM Ujjwala Yojana",
    applicant: "Lakshmi Bai",
    state: "Madhya Pradesh",
    status: "under-review",
    date: "4 hours ago",
  },
  {
    id: "NSAP-2024-5432167",
    scheme: "National Social Assistance",
    applicant: "Mohan Lal",
    state: "Rajasthan",
    status: "rejected",
    date: "5 hours ago",
  },
  {
    id: "STANDUP-2024-7654321",
    scheme: "Stand Up India",
    applicant: "Priya Sharma",
    state: "Maharashtra",
    status: "approved",
    date: "6 hours ago",
  },
];

const statsCards = [
  {
    title: "Total Applications",
    value: "1.25M",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    description: "vs last month",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Active Beneficiaries",
    value: "8.5L",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "vs last month",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    title: "Approval Rate",
    value: "82.3%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle2,
    description: "vs last month",
    gradient: "from-info/20 to-info/5",
  },
  {
    title: "Funds Disbursed",
    value: "Rs 2,450 Cr",
    change: "+18.7%",
    trend: "up",
    icon: IndianRupee,
    description: "vs last month",
    gradient: "from-chart-4/20 to-chart-4/5",
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

export default function AdminDashboard() {
  const [timePeriod, setTimePeriod] = useState("6months");

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
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[160px] shadow-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
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
            Here&apos;s what&apos;s happening with your schemes today.
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
                <ResponsiveContainer width="100%" height="100%">
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
                      name="Applications"
                    />
                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="#2d8659"
                      strokeWidth={3}
                      dot={{ fill: "#2d8659", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Approved"
                    />
                    <Line
                      type="monotone"
                      dataKey="rejected"
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Rejected"
                    />
                  </LineChart>
                </ResponsiveContainer>
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
                    Distribution across scheme categories
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
                <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Disbursement Trend */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Fund Disbursement
              </CardTitle>
              <CardDescription>Monthly disbursement in Crores (INR)</CardDescription>
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
                <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer>
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
                <CardDescription>Latest applications across all schemes</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                  {recentApplications.map((app, index) => (
                    <tr 
                      key={app.id} 
                      className={cn(
                        "transition-colors hover:bg-muted/50",
                        index !== recentApplications.length - 1 && "border-b"
                      )}
                    >
                      <td className="py-4">
                        <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
                          {app.id}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="font-medium">{app.scheme}</span>
                      </td>
                      <td className="hidden py-4 sm:table-cell">
                        <span className="text-muted-foreground">{app.applicant}</span>
                      </td>
                      <td className="hidden py-4 md:table-cell">
                        <span className="text-muted-foreground">{app.state}</span>
                      </td>
                      <td className="py-4">{getStatusBadge(app.status)}</td>
                      <td className="hidden py-4 text-right text-sm text-muted-foreground sm:table-cell">
                        {app.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
