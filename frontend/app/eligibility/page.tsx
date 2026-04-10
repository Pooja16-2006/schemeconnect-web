"use client";

import { Header } from "@/components/header";
import { CitizenAuthGuard } from "@/components/citizen-auth-guard";
import { Footer } from "@/components/footer";
import { ProfileForm } from "@/components/profile-form";
import { useLanguage } from "@/components/language-provider";
import { ArrowRight, CheckCircle2, FileText, Landmark, Shield, Users } from "lucide-react";

export default function EligibilityPage() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: CheckCircle2,
      title: t("eligibilityBenefitInstantTitle"),
      description: t("eligibilityBenefitInstantDescription"),
    },
    {
      icon: Shield,
      title: t("eligibilityBenefitSecureTitle"),
      description: t("eligibilityBenefitSecureDescription"),
    },
    {
      icon: FileText,
      title: t("eligibilityBenefitDocsTitle"),
      description: t("eligibilityBenefitDocsDescription"),
    },
    {
      icon: Users,
      title: t("eligibilityBenefitSupportTitle"),
      description: t("eligibilityBenefitSupportDescription"),
    },
  ];

  const steps = [
    t("eligibilityStepOne"),
    t("eligibilityStepTwo"),
    t("eligibilityStepThree"),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CitizenAuthGuard>
        <main className="flex-1">
          <section className="gov-page-hero">
            <div className="gov-tricolor-stripe" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
              <p className="text-sm text-muted-foreground">
                {t("navHome")} <span className="mx-2 text-[var(--gov-saffron)]">/</span>{" "}
                {t("navEligibility")}
              </p>
              <div className="mt-5 max-w-4xl">
                <div className="gov-section-label">{t("eligibilitySectionLabel")}</div>
                <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-[var(--gov-navy)] sm:text-5xl">
                  {t("eligibilityTitle")}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                  {t("eligibilitySubtitle")}
                </p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="gov-card rounded-3xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">
                    {t("eligibilityStatProfileLabel")}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[var(--gov-navy)]">
                    {t("eligibilityStatProfileValue")}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {t("eligibilityStatProfileDescription")}
                  </p>
                </div>
                <div className="gov-card rounded-3xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">
                    {t("eligibilityStatMatchingLabel")}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[var(--gov-navy)]">
                    {t("eligibilityStatMatchingValue")}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {t("eligibilityStatMatchingDescription")}
                  </p>
                </div>
                <div className="gov-card rounded-3xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">
                    {t("eligibilityStatActionLabel")}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[var(--gov-navy)]">
                    {t("eligibilityStatActionValue")}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {t("eligibilityStatActionDescription")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2">
                <div className="space-y-8">
                  <div className="gov-card overflow-hidden rounded-[2rem]">
                    <div className="bg-[var(--gov-navy)] px-6 py-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        {t("eligibilityWhyLabel")}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold">{t("eligibilityWhyTitle")}</h2>
                    </div>
                    <div className="space-y-5 p-6">
                      {benefits.map((benefit) => (
                        <div key={benefit.title} className="gov-info-row">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--gov-saffron-soft)]">
                            <benefit.icon className="h-5 w-5 text-[var(--gov-saffron)]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--gov-navy)]">{benefit.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="gov-card rounded-3xl p-5">
                      <div className="flex items-center gap-3">
                        <Landmark className="h-5 w-5 text-[var(--gov-green)]" />
                        <h3 className="font-semibold text-[var(--gov-navy)]">
                          {t("eligibilityGuidanceTitle")}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {t("eligibilityGuidanceDescription")}
                      </p>
                    </div>
                    <div className="gov-card rounded-3xl p-5">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-[var(--gov-green)]" />
                        <h3 className="font-semibold text-[var(--gov-navy)]">
                          {t("eligibilityPrivacyTitle")}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {t("eligibilityPrivacyDescription")}
                      </p>
                    </div>
                  </div>

                  <div className="gov-card rounded-3xl p-6">
                    <p className="gov-section-label">{t("eligibilityHowItWorksLabel")}</p>
                    <div className="mt-5 space-y-4">
                      {steps.map((step, index) => (
                        <div key={step} className="gov-info-row">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gov-navy)] text-sm font-bold text-white">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-7 text-slate-600">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="gov-card overflow-hidden rounded-[2rem]">
                    <div className="bg-[var(--gov-navy)] px-6 py-5 text-white">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                            {t("eligibilityIntakeLabel")}
                          </p>
                          <h2 className="mt-2 text-2xl font-bold">
                            {t("eligibilityIntakeTitle")}
                          </h2>
                        </div>
                        <ArrowRight className="h-6 w-6 text-[var(--gov-gold)]" />
                      </div>
                      <p className="mt-3 text-sm text-white/75">
                        {t("eligibilityIntakeDescription")}
                      </p>
                    </div>
                    <div className="p-6">
                      <ProfileForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </CitizenAuthGuard>
      <Footer />
    </div>
  );
}
