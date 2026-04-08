"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, ChevronRight, Globe2, Menu, Scale, ShieldCheck, UserRound, Volume2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Eligibility", href: "/eligibility" },
  { name: "Schemes", href: "/schemes" },
];

const utilityLinks = [
  { label: "Screen Reader", icon: Volume2 },
  { label: "A-", icon: Scale },
  { label: "A", icon: Scale },
  { label: "A+", icon: Scale },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("schemeconnect_user");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      setUserName(user.name || null);
      setUserRole(user.role || null);
    } catch {
      setUserName(null);
      setUserRole(null);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("schemeconnect_token");
    localStorage.removeItem("schemeconnect_user");
    setUserName(null);
    setUserRole(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gov-border)] bg-background shadow-[0_10px_30px_rgba(0,51,102,0.08)]">
      <div className="gov-tricolor-stripe" />

      <div className="border-b border-[var(--gov-border)] bg-[var(--gov-navy)] text-[11px] text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 px-2 py-1 font-semibold uppercase tracking-[0.18em]">
              Government Service Portal
            </span>
            <span className="hidden text-white/70 sm:inline">Official digital access point for welfare scheme discovery</span>
          </div>
          <div className="flex items-center gap-2">
            {utilityLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                className="rounded-md border border-white/10 px-2 py-1 transition-colors hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
            <div className="ml-2 flex items-center gap-1 rounded-md border border-white/10 px-2 py-1">
              <Globe2 className="h-3.5 w-3.5" />
              <span>EN</span>
              <span className="text-white/50">|</span>
              <span>ಕನ್ನಡ</span>
              <span className="text-white/50">|</span>
              <span>हिंदी</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--gov-border)] bg-[var(--gov-saffron)] px-4 py-2 text-xs font-medium text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden">
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">New</span>
          <div className="gov-marquee">
            <span>
              Citizens are advised to verify eligibility details before proceeding to the official application portal. Keep Aadhaar, bank-linked records, and residence documents ready.
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--gov-paper)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--gov-gold)] bg-white shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gov-navy)] text-sm font-black text-white">
                SC
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gov-saffron)]">भारत सरकार | Government of India</p>
              <h1 className="font-serif text-2xl font-bold text-[var(--gov-navy)]">SchemeConnect</h1>
              <p className="text-xs text-muted-foreground">Citizen welfare scheme guidance and official portal readiness support</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-xl border border-[var(--gov-border)] bg-white px-4 py-2 text-right shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gov-green)]">National Service</p>
              <p className="text-xs text-muted-foreground">Secure public information interface</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full border border-[var(--gov-border)] bg-white">
              <Bell className="h-4 w-4 text-[var(--gov-navy)]" />
            </Button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-[var(--gov-border)] bg-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0" aria-describedby="mobile-nav-description">
              <SheetTitle className="sr-only">Government Portal Navigation</SheetTitle>
              <SheetDescription id="mobile-nav-description" className="sr-only">
                Open the main sections of SchemeConnect.
              </SheetDescription>
              <div className="h-full bg-[var(--gov-paper)]">
                <div className="gov-tricolor-stripe" />
                <div className="border-b border-[var(--gov-border)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">SchemeConnect</p>
                  <p className="mt-2 text-sm text-muted-foreground">Official-style citizen service navigation</p>
                </div>
                <nav className="p-4">
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                          pathname === item.href
                            ? "border-[var(--gov-saffron)] bg-[var(--gov-saffron-soft)] text-[var(--gov-navy)]"
                            : "border-[var(--gov-border)] bg-white text-[var(--gov-navy)] hover:bg-[var(--gov-paper-strong)]",
                        )}
                      >
                        {item.name}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </nav>
                <div className="mt-auto border-t border-[var(--gov-border)] p-4">
                  {userName ? (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-[var(--gov-border)] bg-white p-4">
                        <p className="font-semibold text-[var(--gov-navy)]">{userName}</p>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{userRole}</p>
                      </div>
                      <Button className="w-full gov-button-primary" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full gov-button-primary">Citizen Login</Button>
                      </Link>
                      <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-[var(--gov-border)] bg-white">Admin Login</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden border-t border-[var(--gov-border)] bg-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "gov-nav-link",
                  pathname === item.href && "gov-nav-link-active",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 py-3">
            {userName ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--gov-navy)]">{userName}</p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{userRole}</p>
                </div>
                <Button variant="outline" className="border-[var(--gov-border)] bg-white" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/admin/login">
                  <Button variant="ghost" className="text-[var(--gov-navy)]">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="gov-button-primary">
                    <UserRound className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
