"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
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
  residenceArea: string;
  familySize: string;
  landOwned: string;
  hasBankAccount: string;
}

export function ProfileForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [submitNotice, setSubmitNotice] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
    annualIncome: "",
    caste: "",
    state: "",
    occupation: "",
    gender: "",
    residenceArea: "",
    familySize: "4",
    landOwned: "0",
    hasBankAccount: "yes",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitNotice("");

    try {
      const profile: CitizenProfile = {
        age: parseInt(formData.age),
        gender: formData.gender,
        annual_income: parseFloat(formData.annualIncome),
        caste: formData.caste,
        state: formData.state,
        occupation: formData.occupation,
        residence_area: formData.residenceArea as "rural" | "urban",
        family_size: parseInt(formData.familySize),
        land_owned: parseFloat(formData.landOwned),
        has_bank_account: formData.hasBankAccount === "yes",
      };

      const result: EligibilityResponse = await checkEligibility(profile);

      sessionStorage.setItem("profileData", JSON.stringify(formData));
      sessionStorage.setItem("eligibilityResults", JSON.stringify(result));
      sessionStorage.setItem("profile", JSON.stringify(profile));
      sessionStorage.removeItem("eligibilityNotice");

      router.push("/schemes");
    } catch (error) {
      console.error("Error checking eligibility:", error);
      sessionStorage.setItem("profileData", JSON.stringify(formData));
      sessionStorage.setItem("profile", JSON.stringify({
        age: parseInt(formData.age),
        gender: formData.gender,
        annual_income: parseFloat(formData.annualIncome),
        caste: formData.caste,
        state: formData.state,
        occupation: formData.occupation,
        residence_area: formData.residenceArea,
        family_size: parseInt(formData.familySize),
        land_owned: parseFloat(formData.landOwned),
        has_bank_account: formData.hasBankAccount === "yes",
      }));
      sessionStorage.setItem("eligibilityNotice", t("profileServiceUnavailable"));
      setSubmitNotice(t("profileFallbackNotice"));
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
    formData.gender &&
    formData.residenceArea;

  const completedFields = Object.values(formData).filter(Boolean).length;
  const totalFields = Object.keys(formData).length;
  const progressPercent = (completedFields / totalFields) * 100;

  return (
    <Card className="relative w-full overflow-hidden border-2 shadow-xl" id="eligibility-form">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <CardHeader className="space-y-3 pb-6 pt-8">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl sm:text-3xl">{t("profileFormTitle")}</CardTitle>
        <CardDescription className="text-center text-base sm:text-lg">
          {t("profileFormDescription")}
        </CardDescription>

        <div className="mx-auto max-w-xs pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("profileCompletion")}</span>
            <span className="font-medium text-foreground">
              {completedFields}/{totalFields} {t("profileFieldsSuffix")}
            </span>
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
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              {t("profileFullName")}
            </Label>
            <Input
              id="fullName"
              placeholder={t("profileFullNamePlaceholder")}
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {t("profileAge")}
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                placeholder={t("profileAgePlaceholder")}
                value={formData.age}
                onChange={(e) => updateField("age", e.target.value)}
                className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                {t("profileGender")}
              </Label>
              <NativeSelect
                id="gender"
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="h-12"
              >
                <option value="">{t("profileGenderPlaceholder")}</option>
                <option value="male">{t("profileGenderMale")}</option>
                <option value="female">{t("profileGenderFemale")}</option>
                <option value="other">{t("profileGenderOther")}</option>
              </NativeSelect>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income" className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              {t("profileIncome")}
            </Label>
            <Input
              id="income"
              type="number"
              min="0"
              placeholder={t("profileIncomePlaceholder")}
              value={formData.annualIncome}
              onChange={(e) => updateField("annualIncome", e.target.value)}
              className="h-12 text-base transition-all focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caste" className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              {t("profileCaste")}
            </Label>
            <NativeSelect
              id="caste"
              value={formData.caste}
              onChange={(e) => updateField("caste", e.target.value)}
              className="h-12"
            >
              <option value="">{t("profileCastePlaceholder")}</option>
              {casteCategories.map((caste) => (
                <option key={caste} value={caste}>
                  {caste}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t("profileState")}
            </Label>
            <NativeSelect
              id="state"
              value={formData.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="h-12"
            >
              <option value="">{t("profileStatePlaceholder")}</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation" className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              {t("profileOccupation")}
            </Label>
            <NativeSelect
              id="occupation"
              value={formData.occupation}
              onChange={(e) => updateField("occupation", e.target.value)}
              className="h-12"
            >
              <option value="">{t("profileOccupationPlaceholder")}</option>
              {occupations.map((occupation) => (
                <option key={occupation} value={occupation}>
                  {occupation}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="residenceArea" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t("profileResidenceArea")}
            </Label>
            <NativeSelect
              id="residenceArea"
              value={formData.residenceArea}
              onChange={(e) => updateField("residenceArea", e.target.value)}
              className="h-12"
            >
              <option value="">{t("profileResidenceAreaPlaceholder")}</option>
              <option value="rural">{t("profileResidenceRural")}</option>
              <option value="urban">{t("profileResidenceUrban")}</option>
            </NativeSelect>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="familySize" className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                {t("profileFamilySize")}
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
                {t("profileLandOwned")}
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
              {t("profileBankAccount")}
            </Label>
            <NativeSelect
              id="hasBankAccount"
              value={formData.hasBankAccount}
              onChange={(e) => updateField("hasBankAccount", e.target.value)}
              className="h-12"
            >
              <option value="">{t("profileBankAccountPlaceholder")}</option>
              <option value="yes">{t("profileBankAccountYes")}</option>
              <option value="no">{t("profileBankAccountNo")}</option>
            </NativeSelect>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="group h-14 w-full gap-2 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("profileAnalyzing")}
                </>
              ) : (
                <>
                  {t("profileSubmit")}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            {submitNotice ? <p className="mt-3 text-sm text-chart-4">{submitNotice}</p> : null}
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 px-4 py-3 text-center">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{t("profileSecurity")}</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
