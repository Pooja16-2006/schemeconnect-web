"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { NativeSelect } from "@/components/ui/native-select";
import { loginUser, registerUser } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen" as "citizen" | "admin",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response =
        mode === "login"
          ? await loginUser({ email: form.email, password: form.password })
          : await registerUser(form);

      localStorage.setItem("schemeconnect_token", response.token);
      localStorage.setItem("schemeconnect_user", JSON.stringify(response.user));
      router.push(response.user.role === "admin" ? "/admin" : "/schemes");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : mode === "login"
            ? "Unable to login with those credentials."
            : "Unable to create account.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Account Access</p>
              <h1 className="text-4xl font-bold tracking-tight">Secure citizen and admin access for SchemeConnect.</h1>
              <p className="text-lg text-muted-foreground">
                Sign in as a citizen to apply for schemes, save your application history, and track progress.
              </p>
              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <p className="font-semibold">Administrator access</p>
                <p className="mt-2 text-sm text-muted-foreground">Use the dedicated admin portal for dashboard login.</p>
                <Link href="/admin/login" className="mt-4 inline-block">
                  <Button variant="outline">Open Admin Login</Button>
                </Link>
              </div>
            </div>

            <Card className="border-2 shadow-xl">
              <CardHeader>
                <div className="flex gap-2">
                  <Button variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")}>
                    Login
                  </Button>
                  <Button variant={mode === "register" ? "default" : "outline"} onClick={() => setMode("register")}>
                    Register
                  </Button>
                </div>
                <CardTitle className="pt-4">{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Login to apply and track your scheme applications."
                    : "Create your citizen account for the portal."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <NativeSelect id="role" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as "citizen" | "admin" }))}>
                          <option value="citizen">Citizen</option>
                        </NativeSelect>
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
                  </div>
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
