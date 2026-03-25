"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SchemeCard, SchemeCardSkeleton, type Scheme } from "@/components/scheme-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type EligibilityResponse } from "@/lib/api";

const mockSchemes: Scheme[] = [
  {
    id: "1",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description:
      "Direct income support of Rs. 6,000 per year to farmer families across the country in three equal installments.",
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    eligibilityScore: 95,
    benefits: "Rs. 6,000 per year",
    deadline: "March 31, 2026",
    beneficiaries: "14.5 Crore farmers",
    tags: ["Farmer", "Income Support", "Direct Benefit"],
  },
  {
    id: "2",
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
    description:
      "Health insurance coverage up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization.",
    ministry: "Ministry of Health",
    category: "Healthcare",
    eligibilityScore: 88,
    benefits: "Rs. 5 Lakh health cover",
    beneficiaries: "55 Crore beneficiaries",
    tags: ["Health", "Insurance", "Hospital"],
  },
  {
    id: "3",
    name: "Pradhan Mantri Awas Yojana - Gramin",
    description:
      "Financial assistance for construction of pucca house with basic amenities to eligible rural households.",
    ministry: "Ministry of Rural Development",
    category: "Housing",
    eligibilityScore: 82,
    benefits: "Rs. 1.2-1.3 Lakh",
    deadline: "December 31, 2026",
    beneficiaries: "2.95 Crore houses",
    tags: ["Housing", "Rural", "Construction"],
  },
  {
    id: "4",
    name: "National Social Assistance Programme (NSAP)",
    description:
      "Social pensions for elderly, widows, and disabled persons from Below Poverty Line households.",
    ministry: "Ministry of Rural Development",
    category: "Social Security",
    eligibilityScore: 76,
    benefits: "Rs. 200-500 per month",
    beneficiaries: "3.1 Crore beneficiaries",
    tags: ["Pension", "BPL", "Elderly"],
  },
  {
    id: "5",
    name: "Pradhan Mantri Ujjwala Yojana",
    description:
      "Free LPG connections to women from Below Poverty Line households to ensure clean cooking fuel.",
    ministry: "Ministry of Petroleum",
    category: "Energy",
    eligibilityScore: 91,
    benefits: "Free LPG connection",
    beneficiaries: "9 Crore connections",
    tags: ["LPG", "Women", "BPL"],
  },
  {
    id: "6",
    name: "Sukanya Samriddhi Yojana",
    description:
      "Savings scheme for girl child with attractive interest rates and tax benefits under section 80C.",
    ministry: "Ministry of Finance",
    category: "Education",
    eligibilityScore: 85,
    benefits: "7.6% interest rate",
    beneficiaries: "3 Crore accounts",
    tags: ["Savings", "Girl Child", "Education"],
  },
  {
    id: "7",
    name: "MGNREGA - Mahatma Gandhi National Rural Employment Guarantee",
    description:
      "Legal guarantee of 100 days of wage employment per household to adult members in rural areas.",
    ministry: "Ministry of Rural Development",
    category: "Employment",
    eligibilityScore: 78,
    benefits: "100 days employment",
    beneficiaries: "15 Crore households",
    tags: ["Employment", "Rural", "Wage"],
  },
  {
    id: "8",
    name: "Stand Up India",
    description:
      "Bank loans between Rs. 10 Lakh to Rs. 1 Crore for SC/ST and women entrepreneurs.",
    ministry: "Ministry of Finance",
    category: "Entrepreneurship",
    eligibilityScore: 72,
    benefits: "Rs. 10L - 1Cr loan",
    beneficiaries: "1.8 Lakh beneficiaries",
    tags: ["Loan", "SC/ST", "Women", "Business"],
  },
];

const categories = [
  "All Categories",
  "Agriculture",
  "Healthcare",
  "Housing",
  "Social Security",
  "Energy",
  "Education",
  "Employment",
  "Entrepreneurship",
];

export default function SchemesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("eligibility");
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    // Try to get eligibility results from ML service (stored by profile form)
    const storedResults = sessionStorage.getItem("eligibilityResults");
    if (storedResults) {
      try {
        const result: EligibilityResponse = JSON.parse(storedResults);
        // Convert ML response to Scheme format expected by frontend
        const mlSchemes: Scheme[] = result.results.map((r) => ({
          id: r.scheme_id,
          name: r.scheme_name,
          description: r.benefits,
          ministry: "Government of India",
          category: r.category,
          eligibilityScore: r.eligibility_score,
          benefits: r.benefits,
          deadline: "Varies by scheme",
          beneficiaries: "Multiple beneficiaries",
          tags: [r.category, r.eligible ? "Eligible" : "Not Eligible"],
        }));
        setSchemes(mlSchemes);
        setIsLoading(false);
        return;
      } catch (e) {
        console.error("Error parsing eligibility results:", e);
      }
    }
    // Fallback to mock data if no ML results
    const timer = setTimeout(() => {
      setSchemes(mockSchemes);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredSchemes = schemes
    .filter((scheme) => {
      const matchesSearch =
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All Categories" ||
        scheme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "eligibility") {
        return b.eligibilityScore - a.eligibilityScore;
      }
      return a.name.localeCompare(b.name);
    });

  const highlyEligibleCount = schemes.filter(
    (s) => s.eligibilityScore >= 90
  ).length;
  
  const totalBenefits = schemes.length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="relative overflow-hidden border-b">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          </div>
          
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered Matching
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Eligible Schemes For You
                </h1>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Based on your profile, we found {schemes.length} government schemes you may be eligible for
                </p>
              </div>
              
              {/* Stats badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">{highlyEligibleCount}</div>
                    <div className="text-xs text-muted-foreground">Highly Eligible</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{totalBenefits}</div>
                    <div className="text-xs text-muted-foreground">Total Schemes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search schemes by name, category, or keywords..."
                  className="h-12 pl-11 text-base shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 w-full shadow-sm sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 w-full shadow-sm sm:w-[180px]">
                    <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eligibility">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Highest Eligibility
                      </span>
                    </SelectItem>
                    <SelectItem value="name">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "All Categories") && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 pr-1.5"
                  >
                    <Search className="h-3 w-3" />
                    {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "All Categories" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 pr-1.5"
                  >
                    <Filter className="h-3 w-3" />
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("All Categories")}
                      className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Schemes Grid */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <SchemeCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredSchemes.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-muted-foreground">
                  Showing {filteredSchemes.length} of {schemes.length} schemes
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSchemes.map((scheme, index) => (
                    <div
                      key={scheme.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <SchemeCard
                        scheme={scheme}
                        onApply={(id) => {
                          console.log("Applying for scheme:", id);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">No schemes found</h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Try adjusting your search or filter to find more schemes that match your criteria
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
