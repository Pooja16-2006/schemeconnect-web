"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, Activity, RefreshCw, XCircle } from "lucide-react";
import { getAdminApplications, updateAdminApplicationStatus, type ApplicationRecord } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function StatusBadge({ status }: { status: ApplicationRecord["status"] }) {
  switch (status) {
    case "approved":
      return <Badge className="border-green-300 bg-green-100 text-green-700"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
    case "rejected":
      return <Badge className="border-red-300 bg-red-100 text-red-700"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
    case "under-review":
      return <Badge className="border-blue-300 bg-blue-100 text-blue-700"><Activity className="mr-1 h-3 w-3" />Under Review</Badge>;
    default:
      return <Badge className="border-yellow-300 bg-yellow-100 text-yellow-700"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
  }
}

function formatSubmittedAt(createdAt?: string) {
  if (!createdAt) return "Unknown";

  return new Date(createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SubmissionsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchApplications() {
    setLoading(true);
    try {
      const data = await getAdminApplications();
      setApplications(data.applications);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  }

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
    } catch {
      router.replace("/admin/login");
      return;
    }

    fetchApplications();
  }, [router]);

  async function handleStatusUpdate(applicationId: string, status: ApplicationRecord["status"]) {
    setUpdatingId(applicationId);
    try {
      const data = await updateAdminApplicationStatus(applicationId, status);
      setApplications((current) =>
        current.map((item) => (item.applicationId === applicationId ? data.application : item)),
      );
    } catch (error) {
      console.error("Failed to update application", error);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Citizen Submissions</h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchApplications} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>All Scheme Applications</CardTitle>
            <CardDescription>
              {loading ? "Loading..." : `${applications.length} total submissions from citizens`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No applications yet. Citizens haven&apos;t submitted any applications.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 font-semibold">Application ID</th>
                      <th className="pb-3 font-semibold">Citizen</th>
                      <th className="pb-3 font-semibold">Scheme</th>
                      <th className="hidden pb-3 font-semibold md:table-cell">State</th>
                      <th className="hidden pb-3 font-semibold md:table-cell">Fraud Score</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="hidden pb-3 font-semibold sm:table-cell">Submitted</th>
                      <th className="pb-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, index) => (
                      <tr
                        key={app.applicationId}
                        className={`border-b transition-colors hover:bg-muted/40 ${index % 2 === 0 ? "" : "bg-muted/10"}`}
                      >
                        <td className="py-3">
                          <span className="rounded bg-muted px-2 py-1 font-mono text-xs">{app.applicationId}</span>
                        </td>
                        <td className="py-3 font-medium">{app.citizenName || "-"}</td>
                        <td className="py-3">{app.schemeName}</td>
                        <td className="hidden py-3 text-muted-foreground md:table-cell">{app.state || "-"}</td>
                        <td className="hidden py-3 md:table-cell">
                          <span
                            className={`font-semibold ${
                              (app.fraudScore ?? 0) >= 70
                                ? "text-red-600"
                                : (app.fraudScore ?? 0) >= 40
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {app.fraudScore ?? 0}
                          </span>
                          {app.manualReviewRequired ? <span className="ml-2 text-xs text-red-500">Review</span> : null}
                        </td>
                        <td className="py-3"><StatusBadge status={app.status} /></td>
                        <td className="hidden py-3 text-xs text-muted-foreground sm:table-cell">
                          {formatSubmittedAt(app.createdAt)}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {app.status !== "approved" ? (
                              <Button
                                size="sm"
                                className="h-7 bg-green-600 text-xs hover:bg-green-700"
                                disabled={updatingId === app.applicationId}
                                onClick={() => handleStatusUpdate(app.applicationId, "approved")}
                              >
                                Approve
                              </Button>
                            ) : null}
                            {app.status !== "rejected" ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 text-xs"
                                disabled={updatingId === app.applicationId}
                                onClick={() => handleStatusUpdate(app.applicationId, "rejected")}
                              >
                                Reject
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
