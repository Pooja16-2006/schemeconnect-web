"use client";

import { CheckCircle2, FileText, Search, Users, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Search,
    title: "Smart Matching",
    description: "AI-powered scheme matching based on your profile",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: FileText,
    title: "Easy Applications",
    description: "Apply to multiple schemes with a single profile",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: CheckCircle2,
    title: "Real-time Tracking",
    description: "Track your application status instantly",
    color: "from-info/20 to-info/5",
  },
  {
    icon: Users,
    title: "1000+ Schemes",
    description: "Access central and state government schemes",
    color: "from-chart-4/20 to-chart-4/5",
  },
];

const stats = [
  { value: "5M+", label: "Citizens Served", icon: Users },
  { value: "1000+", label: "Active Schemes", icon: FileText },
  { value: "28", label: "States Covered", icon: Shield },
  { value: "95%", label: "Match Accuracy", icon: Sparkles },
];

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Hero text */}
        <div className="text-center">
          {/* Trust badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent shadow-sm shadow-accent/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Trusted by 5 Million+ Citizens
          </div>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Government Schemes
            <span className="relative mt-2 block">
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                You&apos;re Eligible For
              </span>
              <svg className="absolute -bottom-2 left-1/2 w-48 -translate-x-1/2 text-accent/40 sm:w-64" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 100 4 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            SchemeConnect helps Indian citizens find and apply for welfare
            schemes from central and state governments. 
            <span className="font-medium text-foreground"> Check your eligibility in minutes, not days.</span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group h-12 min-w-[200px] gap-2 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30" asChild>
              <Link href="#eligibility-form">
                Check Eligibility Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 min-w-[200px] text-base" asChild>
              <Link href="/schemes">
                Browse All Schemes
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:mt-24">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border bg-card p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <div className="text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-5 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
