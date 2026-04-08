import { Header } from "@/components/header";
import { CitizenAuthGuard } from "@/components/citizen-auth-guard";
import { Footer } from "@/components/footer";
import { ProfileForm } from "@/components/profile-form";
import { ArrowRight, CheckCircle2, FileText, Landmark, Shield, Users } from "lucide-react";

const benefits = [
  {
    icon: CheckCircle2,
    title: "Instant Eligibility Check",
    description: "Get matched with schemes within seconds based on your profile",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared with third parties",
  },
  {
    icon: FileText,
    title: "Complete Documentation",
    description: "Get a list of required documents for each scheme",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Access to helpdesk for application assistance",
  },
];

export default function EligibilityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CitizenAuthGuard>
        <main className="flex-1">
        <section className="gov-page-hero">
          <div className="gov-tricolor-stripe" />
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-sm text-muted-foreground">
              Home <span className="mx-2 text-[var(--gov-saffron)]">/</span> Eligibility
            </p>
            <div className="mt-5 max-w-4xl">
              <div className="gov-section-label">Citizen Readiness Check</div>
              <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-[var(--gov-navy)] sm:text-5xl">
                Check Your Welfare Scheme Eligibility
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Submit your household and income details once. SchemeConnect compares them against known eligibility patterns and government program rules so you can focus on the right schemes first.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="gov-card rounded-3xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">Single profile</p>
                <p className="mt-2 text-2xl font-bold text-[var(--gov-navy)]">1 Form</p>
                <p className="mt-2 text-sm text-slate-600">Use one guided intake instead of checking schemes one by one.</p>
              </div>
              <div className="gov-card rounded-3xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">Matching engine</p>
                <p className="mt-2 text-2xl font-bold text-[var(--gov-navy)]">ML + Rules</p>
                <p className="mt-2 text-sm text-slate-600">Combines your profile data with the strongest visible public criteria.</p>
              </div>
              <div className="gov-card rounded-3xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">Next action</p>
                <p className="mt-2 text-2xl font-bold text-[var(--gov-navy)]">Portal Ready</p>
                <p className="mt-2 text-sm text-slate-600">Get documents and next steps before moving to the official application website.</p>
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Why This Matters</p>
                    <h2 className="mt-2 text-2xl font-bold">A simpler first step for citizens</h2>
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
                      <h3 className="font-semibold text-[var(--gov-navy)]">Government-style guidance</h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      We help you understand likely eligibility before you go to the official department website.
                    </p>
                  </div>
                  <div className="gov-card rounded-3xl p-5">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-[var(--gov-green)]" />
                      <h3 className="font-semibold text-[var(--gov-navy)]">Privacy notice</h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Your session data is used for scheme matching and can remain local unless you choose to continue into account flows.
                    </p>
                  </div>
                </div>

                <div className="gov-card rounded-3xl p-6">
                  <p className="gov-section-label">How It Works</p>
                  <div className="mt-5 space-y-4">
                    {[
                      "Enter profile details such as age, income, occupation, and location.",
                      "Let the eligibility engine rank relevant government schemes for your situation.",
                      "Review document checklists and continue to the official portal for final submission.",
                    ].map((step, index) => (
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
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Eligibility Intake</p>
                        <h2 className="mt-2 text-2xl font-bold">Quick Eligibility Checker</h2>
                      </div>
                      <ArrowRight className="h-6 w-6 text-[var(--gov-gold)]" />
                    </div>
                    <p className="mt-3 text-sm text-white/75">
                      Fill the form below to generate your personalized list of schemes.
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
