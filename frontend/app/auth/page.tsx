"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { loginUser, registerUser } from "@/lib/api";
import { ArrowRight, FileCheck2, Landmark, Lock, ShieldCheck } from "lucide-react";

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

  useEffect(() => {
    const token = localStorage.getItem("schemeconnect_token");
    const storedUser = localStorage.getItem("schemeconnect_user");

    if (!token || !storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser) as { role?: string };
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      localStorage.removeItem("schemeconnect_token");
      localStorage.removeItem("schemeconnect_user");
    }
  }, [router]);

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
      router.push(response.user.role === "admin" ? "/admin" : "/dashboard");
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
      <main className="flex-1">
        <section className="gov-page-hero -mt-6">
          <div className="gov-tricolor-stripe" />
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <p className="text-sm text-muted-foreground">
              Home <span className="mx-2 text-[var(--gov-saffron)]">/</span> Account Access
            </p>
            <div className="mt-4 max-w-4xl">
              <div className="gov-section-label">Secure Citizen Access</div>
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-[var(--gov-navy)] sm:text-5xl">
                Find schemes you actually qualify for
              </h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
                SchemeConnect helps Karnataka citizens check eligibility across 14 schemes including PM-KISAN, Ayushman Bharat and Gruha Lakshmi.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
              <div className="space-y-6">
                <div className="gov-card rounded-[2rem] p-6">
                  <p className="gov-section-label">CITIZEN BENEFITS</p>
                  <div className="mt-5 space-y-4">
                    {[
                      {
                        title: "Instant eligibility checks",
                        desc: "Quickly see if you qualify for PM-KISAN, Ayushman Bharat, Gruha Lakshmi and other schemes.",
                      },
                      {
                        title: "Application tracking",
                        desc: "Track applications and portal readiness from a single dashboard.",
                      },
                      {
                        title: "Separate citizen access",
                        desc: "Keep citizen accounts separate from admin workflows for privacy and clarity.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="gov-info-row">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gov-green-soft)]">
                          <FileCheck2 className="h-4 w-4 text-[var(--gov-green)]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--gov-navy)]">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gov-card rounded-3xl p-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-[var(--gov-saffron)]" />
                    <h2 className="font-semibold text-[var(--gov-navy)]">Administrator access</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Administrative users should continue through the dedicated admin login route for dashboard and submissions management.
                  </p>
                  <Link href="/admin/login" className="mt-4 inline-block">
                    <Button variant="outline" className="border-[var(--gov-border)] bg-white">
                      Open Admin Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="gov-card rounded-3xl p-6">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-[var(--gov-green)]" />
                    <h2 className="font-semibold text-[var(--gov-navy)]">Security notice</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Use a strong password and do not share your credentials. Final scheme approvals still happen only on the official government system.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-[420px] mx-auto">
                <Card className="gov-card gap-0 py-0 overflow-visible rounded-[2rem] border-0 shadow-xl -mt-6">
                  <CardHeader className="relative bg-[var(--gov-navy)] text-white pt-20 pb-6 px-6 rounded-t-[2rem] overflow-visible">

                    <div
                      aria-hidden="true"
                      className="absolute left-0 right-0 bottom-0 h-14 pointer-events-none bg-gradient-to-b from-[rgba(13,43,85,0)] via-[rgba(13,43,85,0.08)] to-[rgba(13,43,85,0)] backdrop-blur-[6px]"
                    />

                    <div className="flex gap-3 justify-center mb-4 z-10 relative">
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={
                          (mode === "login"
                            ? "bg-[var(--gov-saffron)] text-[var(--gov-navy)] shadow-sm"
                            : "bg-white/10 text-white/90 hover:bg-white/20") +
                          " px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                        }
                      >
                        Login
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        className={
                          (mode === "register"
                            ? "bg-white text-[var(--gov-navy)] shadow-sm"
                            : "bg-white/10 text-white/90 hover:bg-white/20") +
                          " px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                        }
                      >
                        Register
                      </button>
                    </div>

                    <div className="text-center z-10 relative">
                      <CardTitle className="text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
                      <CardDescription className="text-white/80 max-w-[36rem] mx-auto mt-2">
                        {mode === "login"
                          ? "Login to continue using the citizen service portal."
                          : "Create a citizen account for a guided welfare discovery flow."}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="bg-[var(--gov-paper)] p-6 rounded-b-[2rem]">
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

                      <Button type="submit" className="gov-button-primary w-full bg-[var(--gov-saffron)] text-[var(--gov-navy)]" disabled={isLoading}>
                        {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
                      </Button>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex-1 h-px bg-slate-200" />
                        <div className="px-2 text-xs uppercase tracking-wider">or</div>
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>

                      <div className="text-center text-sm">
                        {mode === "login" ? (
                          <button type="button" onClick={() => setMode("register")} className="text-[var(--gov-saffron)] font-medium">
                            New to SchemeConnect? Create an account
                          </button>
                        ) : (
                          <button type="button" onClick={() => setMode("login")} className="text-[var(--gov-navy)] font-medium">
                            Already have an account? Login
                          </button>
                        )}
                      </div>

                      <div className="gov-divider pt-2" />
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-[var(--gov-green)]" />
                        Protected citizen access workflow
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
