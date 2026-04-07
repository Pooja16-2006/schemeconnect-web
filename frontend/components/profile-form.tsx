"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, ShieldCheck, Lock, Sparkles, User, Calendar, Wallet, MapPin, Briefcase, Users, Landmark, House } from "lucide-react";
import { checkEligibility, type CitizenProfile, type EligibilityResponse } from "@/lib/api";
import { casteCategories, indianStates, occupations } from "@/lib/portal-data";

interface FormData {
  fullName: string;
  age: string;
  annualIncome: string;
  caste: string;
  state: string;
  occupation: string;
  gender: string;
  familySize: string;
  landOwned: string;
  hasBankAccount: string;
}

export function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
    annualIncome: "",
      caste: "",
      state: "",
      occupation: "",
      gender: "",
      familySize: "4",
      landOwned: "0",
      hasBankAccount: "yes",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Map form data to ML service format
      const profile: CitizenProfile = {
        age: parseInt(formData.age),
        gender: formData.gender,
        annual_income: parseFloat(formData.annualIncome),
        caste: formData.caste,
        state: formData.state,
        occupation: formData.occupation,
        family_size: parseInt(formData.familySize),
        land_owned: parseFloat(formData.landOwned),
        has_bank_account: formData.hasBankAccount === "yes",
      };

      // Call ML service
      const result: EligibilityResponse = await checkEligibility(profile);

      // Store results in session storage for the schemes page
      sessionStorage.setItem("profileData", JSON.stringify(formData));
      sessionStorage.setItem("eligibilityResults", JSON.stringify(result));
      sessionStorage.setItem("profile", JSON.stringify(profile));

      router.push("/schemes");
    } catch (error) {
      console.error("Error checking eligibility:", error);
      // Still navigate to schemes page even on error (will show mock data)
      sessionStorage.setItem("profileData", JSON.stringify(formData));
      router.push("/schemes");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.fullName &&
    formData.age &&
    formData.annualIncome &&
    formData.caste &&
    formData.state &&
    formData.occupation &&
    formData.gender;

  const completedFields = Object.values(formData).filter(Boolean).length;
  const totalFields = Object.keys(formData).length;
  const progressPercent = (completedFields / totalFields) * 100;

  return (
    <Card className="relative w-full overflow-hidden border-2 shadow-xl" id="eligibility-form">
      {/* Decorative gradient */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <CardHeader className="space-y-3 pb-6 pt-8">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl sm:text-3xl">Check Your Eligibility</CardTitle>
        <CardDescription className="text-center text-base sm:text-lg">
          Enter your details to discover government schemes you may be eligible for
        </CardDescription>
        
        {/* Progress indicator */}
        <div className="mx-auto max-w-xs pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Profile completion</span>
            <span className="font-medium text-foreground">{completedFields}/{totalFields} fields</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name (as per Aadhaar)
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {/* Age and Gender Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => updateField("age", e.target.value)}
                className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                Gender
              </Label>
              <NativeSelect
                id="gender"
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="h-12"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </NativeSelect>
            </div>
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <Label htmlFor="income" className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              Annual Family Income (in INR)
            </Label>
            <Input
              id="income"
              type="number"
              min="0"
              placeholder="e.g., 250000"
              value={formData.annualIncome}
              onChange={(e) => updateField("annualIncome", e.target.value)}
              className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {/* Caste Category */}
          <div className="space-y-2">
            <Label htmlFor="caste" className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              Caste Category
            </Label>
            <NativeSelect
              id="caste"
              value={formData.caste}
              onChange={(e) => updateField("caste", e.target.value)}
              className="h-12"
            >
              <option value="">Select category</option>
              {casteCategories.map((caste) => (
                <option key={caste} value={caste}>
                  {caste}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              State of Residence
            </Label>
            <NativeSelect
              id="state"
              value={formData.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="h-12"
            >
              <option value="">Select your state</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <Label htmlFor="occupation" className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Occupation
            </Label>
            <NativeSelect
              id="occupation"
              value={formData.occupation}
              onChange={(e) => updateField("occupation", e.target.value)}
              className="h-12"
            >
              <option value="">Select occupation</option>
              {occupations.map((occupation) => (
                <option key={occupation} value={occupation}>
                  {occupation}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="familySize" className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                Family Size
              </Label>
              <Input
                id="familySize"
                type="number"
                min="1"
                max="20"
                value={formData.familySize}
                onChange={(e) => updateField("familySize", e.target.value)}
                className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landOwned" className="flex items-center gap-2 text-sm font-medium">
                <House className="h-4 w-4 text-muted-foreground" />
                Land Owned (acres)
              </Label>
              <Input
                id="landOwned"
                type="number"
                min="0"
                step="0.1"
                value={formData.landOwned}
                onChange={(e) => updateField("landOwned", e.target.value)}
                className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hasBankAccount" className="flex items-center gap-2 text-sm font-medium">
              <Landmark className="h-4 w-4 text-muted-foreground" />
              Bank Account Linked for DBT
            </Label>
            <NativeSelect
              id="hasBankAccount"
              value={formData.hasBankAccount}
              onChange={(e) => updateField("hasBankAccount", e.target.value)}
              className="h-12"
            >
              <option value="">Select bank account status</option>
              <option value="yes">Yes, bank account is available</option>
              <option value="no">No, bank account not linked yet</option>
            </NativeSelect>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="group h-14 w-full gap-2 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Your Profile...
                </>
              ) : (
                <>
                  Find Eligible Schemes
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>

          {/* Security notice */}
          <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 px-4 py-3 text-center">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Your data is secure and encrypted. We only use it to check scheme eligibility.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
