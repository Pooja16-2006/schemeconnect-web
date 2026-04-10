"use client";

import Link from "next/link";
import { useState } from "react";
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
  ChevronDown,
  ClipboardList,
  IndianRupee,
  ListChecks,
  MapPinned,
  MoveRight,
  ShieldCheck,
  TriangleAlert,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SchemeViewModel } from "@/lib/portal-data";
import { useLanguage } from "@/components/language-provider";

interface SchemeCardProps {
  scheme: SchemeViewModel;
}

export interface EligibilityFactor {
  label: string;
  met: boolean;
  weight: "high" | "medium" | "low";
  detail?: string;
}

function getScoreStyles(score: number) {
  if (score >= 90) return {
    bg: "bg-gradient-to-br from-accent to-accent/80",
    text: "text-accent-foreground",
    badge: "bg-accent/10 text-accent border-accent/30",
    glow: "shadow-accent/20",
  };
  return {
    bg: "bg-gradient-to-br from-accent to-accent/80",
    text: "text-accent-foreground",
    badge: "bg-accent/10 text-accent border-accent/30",
    glow: "shadow-accent/20",
  };
}

function getScoreLabel(score: number, label: string) {
  if (score >= 90) return label;
  return label;
}

function getWeightBadgeStyles(weight: EligibilityFactor["weight"]) {
  if (weight === "high") {
    return "border-primary/30 bg-primary/10 text-primary";
  }
  if (weight === "medium") {
    return "border-chart-4/30 bg-chart-4/10 text-chart-4";
  }
  return "border-muted bg-muted text-muted-foreground";
}

function ConfidencePanel({
  factors,
  score,
  summary,
}: {
  factors: EligibilityFactor[];
  score: number;
  summary?: { positives: number; concerns: number; blockers: number };
}) {
  const { t } = useLanguage();
  const metCount = factors.filter((factor) => factor.met).length;
  const highImpactCount = factors.filter((factor) => factor.weight === "high" && factor.met).length;

  return (
    <div className="rounded-xl border bg-background/80 p-4">
      {summary ? (
        <div className="mb-4 flex gap-2">
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent/10 py-2">
            <span className="text-lg font-bold text-accent">{summary.positives}</span>
            <span className="text-xs text-accent/80">{t("schemeCardPositive")}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-chart-4/10 py-2">
            <span className="text-lg font-bold text-chart-4">{summary.concerns}</span>
            <span className="text-xs text-chart-4/80">{summary.concerns === 1 ? t("schemeCardConcern") : t("schemeCardConcerns")}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/10 py-2">
            <span className="text-lg font-bold text-destructive">{summary.blockers}</span>
            <span className="text-xs text-destructive/80">{summary.blockers === 1 ? t("schemeCardBlocker") : t("schemeCardBlockers")}</span>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{t("schemeCardConfidenceBreakdown")}</p>
          <p className="text-xs text-muted-foreground">{metCount}/{factors.length} {t("schemeCardCriteriaMet")}</p>
        </div>
        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
          {highImpactCount} {t("schemeCardHighImpact")}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("schemeCardEligibilityConfidence")}</span>
          <span>{score}%</span>
        </div>
        <progress
          className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-primary [&::-webkit-progress-value]:via-accent [&::-webkit-progress-value]:to-primary"
          max={100}
          value={Math.max(0, Math.min(score, 100))}
        />
      </div>

      <div className="mt-4 space-y-2.5">
        {factors.map((factor) => (
          <div key={factor.label} className="rounded-lg border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {factor.met ? (
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-accent" />
                ) : (
                  <TriangleAlert className="mt-0.5 h-4 w-4 text-chart-4" />
                )}
                <div>
                  <p className="text-sm font-medium">{factor.label}</p>
                  {factor.detail ? (
                    <p className="mt-1 text-xs text-muted-foreground">{factor.detail}</p>
                  ) : null}
                </div>
              </div>
              <Badge variant="outline" className={cn("text-[10px] uppercase", getWeightBadgeStyles(factor.weight))}>
                {factor.weight}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const { locale, t } = useLanguage();
  const deadlineLabel = locale === "hi" ? "अंतिम तिथि" : locale === "kn" ? "ಕೊನೆಯ ದಿನಾಂಕ" : "Deadline";
  const scoreStyles = getScoreStyles(scheme.eligibilityScore);
  const [showConfidence, setShowConfidence] = useState(false);
  const factors = scheme.eligibilityFactors;
  const metCount = factors?.filter((factor) => factor.met).length ?? 0;
  
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border border-[var(--gov-border)] bg-[var(--gov-paper)] shadow-[0_16px_30px_rgba(0,51,102,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(0,51,102,0.14)]">
      <div className="gov-tricolor-stripe opacity-90" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[var(--gov-gold)] bg-white text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gov-navy)]">
                {scheme.category}
              </Badge>
              {scheme.eligibilityScore >= 90 && (
                <Badge variant="outline" className="gap-1 border-[var(--gov-green)] bg-[var(--gov-green-soft)] text-xs font-semibold text-[var(--gov-green)]">
                  <Sparkles className="h-3 w-3" />
                  {t("schemeCardTopMatch")}
                </Badge>
              )}
            </div>
            <CardTitle className="line-clamp-2 font-serif text-xl leading-snug text-[var(--gov-navy)] transition-colors group-hover:text-[var(--gov-saffron)]">
              {scheme.name}
            </CardTitle>
          </div>
          
          <button
            type="button"
            onClick={() => factors?.length && setShowConfidence((current) => !current)}
            className={cn(
              "flex min-w-[76px] flex-col items-center rounded-2xl border border-white/40 px-3 py-3 text-center shadow-lg transition-transform",
              factors?.length ? "cursor-pointer hover:scale-[1.02]" : "cursor-default",
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
              {t("schemeCardMatch")}
            </span>
            {factors?.length ? (
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider opacity-80">
                {showConfidence ? t("schemeCardHideWhy") : t("schemeCardWhy")}
              </span>
            ) : null}
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {scheme.description}
        </CardDescription>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <Building2 className="h-4 w-4 text-[var(--gov-navy)]" />
            </div>
            <span className="truncate text-slate-600">{scheme.ministry}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gov-saffron-soft)]">
              <IndianRupee className="h-4 w-4 text-[var(--gov-saffron)]" />
            </div>
            <span className="truncate font-medium text-[var(--gov-navy)]">{scheme.benefits}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <Users className="h-4 w-4 text-[var(--gov-green)]" />
            </div>
            <span className="truncate text-slate-600">{scheme.beneficiaries}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <MapPinned className="h-4 w-4 text-[var(--gov-navy)]" />
            </div>
            <span className="truncate text-slate-600">{scheme.state}</span>
          </div>
          {scheme.deadline && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <Calendar className="h-4 w-4 text-[var(--gov-saffron)]" />
              </div>
              <span className="truncate font-medium text-[var(--gov-saffron)]">{deadlineLabel}: {scheme.deadline}</span>
            </div>
          )}
        </div>

        {factors?.length ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowConfidence((current) => !current)}
              className="flex w-full items-center justify-between rounded-xl border bg-muted/30 p-3 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <ListChecks className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[var(--gov-navy)]">{t("schemeCardConfidenceBreakdown")}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {metCount}/{factors.length} {t("schemeCardCriteriaMet")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {scheme.confidenceSummary ? (
                  <div className="hidden items-center gap-1 sm:flex">
                    {scheme.confidenceSummary.positives > 0 ? (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                        ✓ {scheme.confidenceSummary.positives}
                      </span>
                    ) : null}
                    {scheme.confidenceSummary.concerns > 0 ? (
                      <span className="rounded-full bg-chart-4/15 px-2 py-0.5 text-[10px] font-semibold text-chart-4">
                        ⚠ {scheme.confidenceSummary.concerns}
                      </span>
                    ) : null}
                    {scheme.confidenceSummary.blockers > 0 ? (
                      <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                        ✕ {scheme.confidenceSummary.blockers}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <Badge variant="outline" className="border-[var(--gov-border)] bg-white text-xs text-[var(--gov-navy)]">
                  {scheme.confidenceLabel ?? getScoreLabel(scheme.eligibilityScore, t("schemeCardHighlyEligibleLabel"))}
                </Badge>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    showConfidence ? "rotate-180" : "rotate-0",
                  )}
                />
              </div>
            </button>

            {showConfidence ? (
              <ConfidencePanel
                factors={factors}
                score={scheme.eligibilityScore}
                summary={scheme.confidenceSummary}
              />
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--gov-border)] bg-white/70 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ListChecks className="h-4 w-4 text-primary" />
              {scheme.fitLabel}
            </div>
            {scheme.eligible ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {t("schemeCardMeetCriteria")}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {scheme.reasons[0] ?? t("schemeCardReviewCriteria")}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--gov-border)] bg-white p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ClipboardList className="h-4 w-4 text-primary" />
              {t("schemeCardDocuments")}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {scheme.documents.slice(0, 2).join(", ")}
              {scheme.documents.length > 2 ? "..." : ""}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--gov-border)] bg-white p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MoveRight className="h-4 w-4 text-primary" />
              {t("schemeCardNextStep")}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {scheme.nextSteps[0] ?? t("schemeCardPrepareSubmit")}
            </p>
          </div>
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

      <CardFooter className="flex gap-3 border-t border-[var(--gov-border)] bg-white/60 p-4">
        <Link href={`/schemes/${scheme.id}`} className="flex-1">
          <Button
            variant="default"
            className="gov-button-primary w-full"
            size="sm"
          >
            {t("schemeCardViewDetails")}
          </Button>
        </Link>
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
