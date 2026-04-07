"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { loginUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@schemeconnect.in");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });

      if (response.user.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }

      localStorage.removeItem("schemeconnect_token");
      localStorage.removeItem("schemeconnect_user");
      localStorage.setItem("schemeconnect_token", response.token);
      localStorage.setItem("schemeconnect_user", JSON.stringify(response.user));
      window.location.assign("/admin");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to login to the admin portal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/10 to-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to portal
        </Link>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <CardTitle className="pt-2 text-2xl">Admin Login</CardTitle>
            <CardDescription>Use the seeded administrator account to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login to Admin Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
