import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProfileForm } from "@/components/profile-form";
import { CheckCircle2, FileText, Shield, Users } from "lucide-react";

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
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Check Your Scheme Eligibility
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                Fill in your details to discover government welfare schemes you
                may be eligible for
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Benefits */}
              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold">Why Check Eligibility?</h2>
                <p className="mt-2 text-muted-foreground">
                  SchemeConnect makes it easy to find and apply for government
                  schemes that match your profile.
                </p>
                <div className="mt-8 space-y-6">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <benefit.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{benefit.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 p-6">
                  <h3 className="font-medium text-accent">Data Privacy Notice</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your information is processed securely in accordance with the
                    Digital Personal Data Protection Act, 2023. We do not store
                    your data beyond the session unless you create an account.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div>
                <ProfileForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
