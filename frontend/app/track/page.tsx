import { Header } from "@/components/header";
import { CitizenAuthGuard } from "@/components/citizen-auth-guard";
import { Footer } from "@/components/footer";
import { ApplicationTracker } from "@/components/application-tracker";
import { CircleAlert, FileCheck2, Landmark, SearchCheck } from "lucide-react";

export default function TrackPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CitizenAuthGuard>
        <main className="flex-1">
        <section className="gov-page-hero">
          <div className="gov-tricolor-stripe" />
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-sm text-muted-foreground">
              Home <span className="mx-2 text-[var(--gov-saffron)]">/</span> Track Status
            </p>
            <div className="mt-5 max-w-4xl">
              <div className="gov-section-label">Citizen Application Status</div>
              <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-[var(--gov-navy)] sm:text-5xl">
                Track Your Application Progress
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Check where your submitted application stands, review current status, and see if any manual verification or missing documents are slowing it down.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="gov-card rounded-3xl p-5">
                <FileCheck2 className="h-5 w-5 text-[var(--gov-green)]" />
                <p className="mt-3 font-semibold text-[var(--gov-navy)]">Verification steps</p>
                <p className="mt-2 text-sm text-slate-600">View submitted, review, and final decision stages clearly.</p>
              </div>
              <div className="gov-card rounded-3xl p-5">
                <SearchCheck className="h-5 w-5 text-[var(--gov-green)]" />
                <p className="mt-3 font-semibold text-[var(--gov-navy)]">Application lookup</p>
                <p className="mt-2 text-sm text-slate-600">Search by application ID and review the latest saved application.</p>
              </div>
              <div className="gov-card rounded-3xl p-5">
                <CircleAlert className="h-5 w-5 text-[var(--gov-saffron)]" />
                <p className="mt-3 font-semibold text-[var(--gov-navy)]">Actionable alerts</p>
                <p className="mt-2 text-sm text-slate-600">Spot pending documents and review flags before they turn into delays.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="space-y-6">
                <div className="gov-card rounded-3xl p-6">
                  <p className="gov-section-label">Status Guide</p>
                  <div className="mt-5 space-y-4">
                    {[
                      "Submitted means your application has entered the queue.",
                      "Under review means a department or manual review stage is active.",
                      "Approved or rejected reflects the latest official outcome stored in the system.",
                    ].map((item, index) => (
                      <div key={item} className="gov-info-row">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gov-navy)] text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-7 text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gov-card rounded-3xl p-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-[var(--gov-green)]" />
                    <h2 className="font-semibold text-[var(--gov-navy)]">Help Notice</h2>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    If your application remains under review for a long period, re-check the official scheme portal, helpline, or local authority instructions. SchemeConnect reflects stored application state but does not replace final department action.
                  </p>
                </div>
              </div>

              <div className="gov-card overflow-hidden rounded-[2rem]">
                <div className="bg-[var(--gov-navy)] px-6 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Application Monitoring</p>
                  <h2 className="mt-2 text-2xl font-bold">Scheme Application Tracker</h2>
                </div>
                <div className="p-6">
                  <ApplicationTracker />
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
