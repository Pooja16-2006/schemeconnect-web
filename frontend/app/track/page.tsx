import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ApplicationTracker } from "@/components/application-tracker";

export default function TrackPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Track Application Status
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                Monitor the progress of your scheme applications in real-time
              </p>
            </div>
          </div>
        </section>

        {/* Tracker Content */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <ApplicationTracker />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
