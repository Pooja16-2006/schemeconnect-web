import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { ProfileForm } from "@/components/profile-form";
import { Shield, Building2, Landmark, Award } from "lucide-react";

const trustBadges = [
  { icon: Shield, name: "Digital India", desc: "Initiative" },
  { icon: Building2, name: "MeitY", desc: "Government of India" },
  { icon: Landmark, name: "NIC", desc: "National Informatics Centre" },
  { icon: Award, name: "ISO 27001", desc: "Certified" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        
        {/* Form Section */}
        <section className="relative border-t bg-gradient-to-b from-muted/50 to-background py-16 sm:py-24" id="check-eligibility">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl">
              <ProfileForm />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-t py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Three simple steps to discover and apply for government schemes
              </p>
            </div>
            
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Enter Your Details",
                  description: "Fill in your basic information including age, income, occupation, and location.",
                },
                {
                  step: "02", 
                  title: "Get Matched Schemes",
                  description: "Our AI analyzes your profile and matches you with eligible government schemes.",
                },
                {
                  step: "03",
                  title: "Apply & Track",
                  description: "Apply directly through our portal and track your application status in real-time.",
                },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  {index < 2 && (
                    <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gradient-to-r from-primary/20 to-primary/5 md:block" />
                  )}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
                      {item.step}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="border-t bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Trusted Government Initiative
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Backed by official government bodies and security certifications
              </p>
              
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                {trustBadges.map((badge) => (
                  <div 
                    key={badge.name}
                    className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <badge.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-semibold text-foreground">
                        {badge.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {badge.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
