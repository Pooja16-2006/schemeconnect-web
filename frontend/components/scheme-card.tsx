"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Building2,
  Calendar,
  IndianRupee,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Scheme {
  id: string;
  name: string;
  description: string;
  ministry: string;
  category: string;
  eligibilityScore: number;
  benefits: string;
  deadline?: string;
  beneficiaries: string;
  tags: string[];
}

interface SchemeCardProps {
  scheme: Scheme;
  onApply?: (schemeId: string) => void;
}

function getScoreStyles(score: number) {
  if (score >= 90) return {
    bg: "bg-gradient-to-br from-accent to-accent/80",
    text: "text-accent-foreground",
    badge: "bg-accent/10 text-accent border-accent/30",
    glow: "shadow-accent/20",
  };
  if (score >= 70) return {
    bg: "bg-gradient-to-br from-chart-4 to-chart-4/80",
    text: "text-warning-foreground",
    badge: "bg-chart-4/10 text-chart-4 border-chart-4/30",
    glow: "shadow-chart-4/20",
  };
  return {
    bg: "bg-gradient-to-br from-muted-foreground/80 to-muted-foreground/60",
    text: "text-background",
    badge: "bg-muted text-muted-foreground border-border",
    glow: "shadow-muted-foreground/10",
  };
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Highly Eligible";
  if (score >= 70) return "Likely Eligible";
  return "Partially Eligible";
}

export function SchemeCard({ scheme, onApply }: SchemeCardProps) {
  const scoreStyles = getScoreStyles(scheme.eligibilityScore);
  
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs font-medium text-primary">
                {scheme.category}
              </Badge>
              {scheme.eligibilityScore >= 90 && (
                <Badge variant="outline" className={cn("gap-1 text-xs", scoreStyles.badge)}>
                  <Sparkles className="h-3 w-3" />
                  Top Match
                </Badge>
              )}
            </div>
            <CardTitle className="line-clamp-2 text-lg leading-snug transition-colors group-hover:text-primary">
              {scheme.name}
            </CardTitle>
          </div>
          
          {/* Score badge */}
          <div
            className={cn(
              "flex flex-col items-center rounded-xl px-3 py-2.5 text-center shadow-lg",
              scoreStyles.bg,
              scoreStyles.text,
              scoreStyles.glow
            )}
          >
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold">{scheme.eligibilityScore}</span>
              <span className="text-xs font-medium">%</span>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider opacity-90">
              Match
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {scheme.description}
        </CardDescription>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="truncate text-muted-foreground">{scheme.ministry}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <IndianRupee className="h-4 w-4 text-accent" />
            </div>
            <span className="truncate font-medium text-foreground">{scheme.benefits}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="truncate text-muted-foreground">{scheme.beneficiaries}</span>
          </div>
          {scheme.deadline && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                <Calendar className="h-4 w-4 text-destructive" />
              </div>
              <span className="truncate font-medium text-destructive">Deadline: {scheme.deadline}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {scheme.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
          {scheme.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs font-normal">
              +{scheme.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 border-t bg-muted/30 p-4">
        <Button
          variant="outline"
          className="flex-1 transition-all hover:bg-background"
          size="sm"
        >
          View Details
        </Button>
        <Button
          className="flex-1 gap-1.5 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
          size="sm"
          onClick={() => onApply?.(scheme.id)}
        >
          Apply Now
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function SchemeCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-16 w-16 animate-pulse rounded-xl bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 pt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 w-14 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 p-4">
        <div className="flex w-full gap-3">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
        </div>
      </CardFooter>
    </Card>
  );
}
