"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SchemeCard, SchemeCardSkeleton } from "@/components/scheme-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkEligibility, createApplication, type CitizenProfile, type EligibilityResponse } from "@/lib/api";
import {
  formatIndianCurrency,
  getFallbackEligibilityResponse,
  mapEligibilityResultsToSchemes,
} from "@/lib/portal-data";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";

type StoredProfile = {
  fullName?: string;
  age?: string;
  annualIncome?: string;
  caste?: string;
  state?: string;
  occupation?: string;
  residenceArea?: string;
  familySize?: string;
};

export default function SchemesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [applyingSchemeId, setApplyingSchemeId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("eligibility");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [eligibilityNotice, setEligibilityNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadEligibility() {
      const storedProfile = sessionStorage.getItem("profileData");
      const storedResults = sessionStorage.getItem("eligibilityResults");
      const storedApiProfile = sessionStorage.getItem("profile");
      const storedNotice = sessionStorage.getItem("eligibilityNotice");

      setEligibilityNotice(storedNotice);

      if (!storedProfile && !storedResults && !storedApiProfile) {
        setEligibility(getFallbackEligibilityResponse());
        setIsLoading(false);
        return;
      }

      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch {
          setProfile(null);
        }
      }

      if (storedResults) {
        try {
          setEligibility(JSON.parse(storedResults));
        } catch {
          setEligibility(getFallbackEligibilityResponse());
        }
      } else {
        setEligibility(getFallbackEligibilityResponse());
      }

      if (storedApiProfile) {
        try {
          const parsedProfile = JSON.parse(storedApiProfile) as CitizenProfile;
          const latestEligibility = await checkEligibility(parsedProfile);
          setEligibility(latestEligibility);
          sessionStorage.setItem("eligibilityResults", JSON.stringify(latestEligibility));
        } catch {
          // Keep the last cached or fallback response if the refresh fails.
        }
      }

      setIsLoading(false);
    }

    void loadEligibility();
  }, []);

  const schemes = useMemo(() => mapEligibilityResultsToSchemes(eligibility), [eligibility]);
  const topSchemes = useMemo(() => schemes.filter((scheme) => scheme.eligibilityScore >= 90), [schemes]);
  const otherSchemes = useMemo(() => schemes.filter((scheme) => scheme.eligibilityScore < 90), [schemes]);
  const categories = useMemo(
    () => ["all", ...new Set(schemes.map((scheme) => scheme.category))],
    [schemes],
  );

  const filteredSchemes = useMemo(() => {
    return [...schemes]
      .filter((scheme) => {
        const matchesSearch =
          scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.benefits.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = categoryFilter === "all" || scheme.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return b.eligibilityScore - a.eligibilityScore;
      });
  }, [categoryFilter, schemes, searchQuery, sortBy]);

  const eligibleNowCount = topSchemes.length;
  const categoryCount = Math.max(categories.length - 1, 0);
  const topScheme = schemes[0];

  async function handleApply(schemeId: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("schemeconnect_token") : null;
    const targetScheme = schemes.find((scheme) => scheme.id === schemeId);

    if (!token) {
      router.push("/auth");
      return;
    }

    if (!targetScheme) return;

    try {
      setApplyingSchemeId(schemeId);
      const response = await createApplication({
        citizenName: profile?.fullName,
        schemeId: targetScheme.id,
        schemeName: targetScheme.name,
        ministry: targetScheme.ministry,
        state: profile?.state || targetScheme.state,
        documentsPending: targetScheme.eligible ? [] : targetScheme.documents,
        nextAction: targetScheme.nextSteps[0],
        eta: targetScheme.eligible ? "5-7 working days" : "Document review pending",
      });

      sessionStorage.setItem("latestApplicationId", response.application.applicationId);
      router.push("/track");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to create application right now. Please try again.");
    } finally {
      setApplyingSchemeId(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  Eligibility engine results
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {profile?.fullName ? `${profile.fullName}, here are your best scheme matches` : "Your scheme eligibility results"}
                </h1>
                <p className="mt-3 text-muted-foreground">
                  We ranked schemes using your citizen profile, rule-based checks, and match confidence so you can act on the strongest opportunities first.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="min-w-[160px] border-2">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Eligible now</p>
                    <p className="mt-2 text-3xl font-bold text-accent">{eligibleNowCount}</p>
                  </CardContent>
                </Card>
                <Card className="min-w-[160px] border-2">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Categories</p>
                    <p className="mt-2 text-3xl font-bold text-chart-4">{categoryCount}</p>
                  </CardContent>
                </Card>
                <Card className="min-w-[160px] border-2">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Top confidence</p>
                    <p className="mt-2 text-3xl font-bold text-primary">{topScheme?.eligibilityScore ?? 0}%</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserRound className="h-5 w-5 text-primary" />
                    Citizen snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">State</p>
                    <p className="mt-1 font-semibold">{profile?.state ?? "Demo profile"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Occupation</p>
                    <p className="mt-1 font-semibold">{profile?.occupation ?? "Farmer"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Income</p>
                    <p className="mt-1 font-semibold">
                      {profile?.annualIncome ? formatIndianCurrency(Number(profile.annualIncome)) : "Rs. 2,40,000"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Family size</p>
                    <p className="mt-1 font-semibold">{profile?.familySize ?? "4 members"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-lg">Best next action</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary-foreground/85">
                    Start with <span className="font-semibold">{topScheme?.name ?? "your strongest scheme match"}</span>, then prepare Aadhaar, income proof, and bank-linked documents before applying.
                  </p>
                  <Button
                    className="mt-4 gap-2 bg-background text-foreground hover:bg-background/90"
                    onClick={() => router.push("/track")}
                  >
                    Track application journey
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-12 pl-11"
                  placeholder="Search by scheme, benefit, or tag"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-12 min-w-[180px]">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 min-w-[180px]">
                    <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eligibility">Highest confidence</SelectItem>
                    <SelectItem value="name">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {eligibilityNotice ? (
              <Card className="mt-4 border-chart-4/40 bg-chart-4/5">
                <CardContent className="p-4 text-sm text-chart-4">
                  {eligibilityNotice}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <SchemeCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <Badge className="gap-1 border-accent/30 bg-accent/10 text-accent hover:bg-accent/10">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {eligibleNowCount} highly eligible
                  </Badge>
                  <Badge className="gap-1 border-chart-4/30 bg-chart-4/10 text-chart-4 hover:bg-chart-4/10">
                    <Filter className="h-3.5 w-3.5" />
                    {otherSchemes.length ? "Includes strong and emerging matches" : "90%+ match threshold applied"}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {filteredSchemes.length} showing
                  </Badge>
                </div>

                {filteredSchemes.length ? (
                  <>
                    {filteredSchemes.filter((scheme) => scheme.eligibilityScore >= 90).length > 0 && (
                      <>
                        <div className="mb-4 flex items-center gap-3">
                          <BadgeCheck className="h-5 w-5 text-accent" />
                          <h2 className="text-lg font-semibold">Highly Eligible - 90%+ Match</h2>
                          <Badge className="border-accent/30 bg-accent/10 text-accent hover:bg-accent/10">
                            {filteredSchemes.filter((scheme) => scheme.eligibilityScore >= 90).length} schemes
                          </Badge>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                          {filteredSchemes.filter((scheme) => scheme.eligibilityScore >= 90).map((scheme, index) => (
                            <div
                              key={scheme.id}
                              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                              style={{ animationDelay: `${index * 60}ms` }}
                            >
                              <SchemeCard scheme={scheme} onApply={handleApply} isApplying={applyingSchemeId === scheme.id} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {filteredSchemes.filter((scheme) => scheme.eligibilityScore < 90).length > 0 && (
                      <>
                        <div className="mb-4 mt-12 flex items-center gap-3">
                          <Filter className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-semibold">Other Schemes You May Qualify For</h2>
                          <Badge variant="outline">
                            {filteredSchemes.filter((scheme) => scheme.eligibilityScore < 90).length} schemes
                          </Badge>
                        </div>
                        <p className="mb-6 text-sm text-muted-foreground">
                          These schemes have a lower match score but may still be relevant depending on your specific situation.
                        </p>
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                          {filteredSchemes.filter((scheme) => scheme.eligibilityScore < 90).map((scheme, index) => (
                            <div
                              key={scheme.id}
                              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                              style={{ animationDelay: `${index * 60}ms` }}
                            >
                              <SchemeCard scheme={scheme} onApply={handleApply} isApplying={applyingSchemeId === scheme.id} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Card className="border-2 border-dashed">
                    <CardContent className="flex flex-col items-center py-16 text-center">
                      <Search className="h-10 w-10 text-muted-foreground" />
                      <h2 className="mt-4 text-xl font-semibold">No matching schemes found</h2>
                      <p className="mt-2 max-w-md text-muted-foreground">
                        No schemes match your current search or filter settings. Update your filters or profile details and try again.
                      </p>
                      <Button
                        className="mt-6"
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setCategoryFilter("all");
                          if (schemes.length === 0) {
                            router.push("/");
                          }
                        }}
                      >
                        {schemes.length === 0 ? "Update profile" : "Reset filters"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
