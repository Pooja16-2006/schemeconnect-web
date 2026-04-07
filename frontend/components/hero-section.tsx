"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Search, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Search,
    title: "Eligibility in Seconds",
    description: "Citizens enter one profile and instantly see central plus state schemes they can access.",
    color: "from-primary/15 to-primary/5",
  },
  {
    icon: Sparkles,
    title: "ML Match Score",
    description: "Every result includes a confidence score and a simple reason so people know what to act on.",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: FileText,
    title: "Document Readiness",
    description: "The portal highlights what proof is needed before a citizen visits an office.",
    color: "from-info/20 to-info/5",
  },
  {
    icon: CheckCircle2,
    title: "Track Every Step",
    description: "Applications move from submission to approval with a clean, understandable progress view.",
    color: "from-chart-4/20 to-chart-4/5",
  },
];

const stats = [
  { value: "7", label: "Schemes predicted for one citizen", icon: Sparkles },
  { value: "3 min", label: "Average profile completion", icon: FileText },
  { value: "28+", label: "States and UTs covered", icon: Shield },
  { value: "1", label: "Citizen profile for many schemes", icon: Users },
];

const spotlight = [
  "Income, caste, age, occupation, and state-aware matching",
  "Recommendation engine for near-match schemes",
  "Admin analytics for approval trends and fund flow",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.03_250),transparent_35%),radial-gradient(circle_at_80%_20%,oklch(0.9_0.05_155),transparent_30%),linear-gradient(180deg,oklch(0.985_0.004_250),oklch(0.97_0.008_250))]" />
        <div className="hero-tricolor absolute inset-0" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            Government Scheme Benefits and Citizen Eligibility Tracker
          </div>

          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            One citizen profile.
            <span className="mt-2 block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Every scheme they actually qualify for.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            SchemeConnect reduces wasted office visits by helping citizens discover benefits before they apply. We combine MERN workflows with ML-powered eligibility scoring to show who qualifies now, who is close, and what documents they need next.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="group gap-2 shadow-lg shadow-primary/20" asChild>
              <Link href="#eligibility-form">
                Try the citizen flow
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/admin">View admin dashboard</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground">
            {spotlight.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-primary/10 bg-card p-6 shadow-xl shadow-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Live outcome preview</p>
                <h2 className="mt-1 text-2xl font-bold">You qualify for 7 schemes</h2>
              </div>
              <div className="rounded-2xl bg-accent px-4 py-3 text-accent-foreground">
                <p className="text-xs uppercase tracking-wide">Top match</p>
                <p className="text-xl font-bold">95%</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { name: "PM Kisan Samman Nidhi", status: "Eligible now", score: "95%" },
                { name: "Ayushman Bharat", status: "Eligible now", score: "90%" },
                { name: "PM Awas Yojana", status: "Needs one document", score: "82%" },
              ].map((scheme) => (
                <div key={scheme.name} className="flex items-center justify-between rounded-2xl border bg-muted/30 px-4 py-3">
                  <div>
                    <p className="font-medium">{scheme.name}</p>
                    <p className="text-sm text-muted-foreground">{scheme.status}</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">{scheme.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-card p-5 shadow-sm">
                <stat.icon className="h-5 w-5 text-primary" />
                <p className="mt-4 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
