"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, ChevronRight, Globe2, Menu, ShieldCheck, UserRound, Volume2 } from "lucide-react";
import {
  Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/components/language-provider";
import { Locale } from "@/lib/i18n";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { locale, setLocale, t } = useLanguage();

  const navigation = [
    { name: t("navHome"), href: "/" },
    { name: t("navEligibility"), href: "/eligibility" },
    { name: t("navSchemes"), href: "/schemes" },
  ];

  const languages: { code: Locale; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "hi", label: "हिंदी" },
  ];

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

      {/* Top utility bar */}
      <div className="border-b border-[var(--gov-border)] bg-[var(--gov-navy)] text-[11px] text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 px-2 py-1 font-semibold uppercase tracking-[0.18em]">
              {t("portalLabel")}
            </span>
            <span className="hidden text-white/70 sm:inline">{t("portalSubtitle")}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-md border border-white/10 px-2 py-1 transition-colors hover:bg-white/10">
              <Volume2 className="inline h-3 w-3 mr-1" />
              Screen Reader
            </button>
           {/* Language switcher buttons */}
            <div className="ml-2 flex items-center gap-1 rounded-full border border-white/20 bg-white/5 p-0.5">
              <Globe2 className="h-3.5 w-3.5 ml-2 mr-0.5 text-white/60" />
                {languages.map((lang) => (
                <button
                   key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-all duration-200",
                  locale === lang.code
                  ? "bg-[var(--gov-saffron)] text-white shadow-md scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                {lang.label}
              </button>
             ))}
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="border-b border-[var(--gov-border)] bg-[var(--gov-saffron)] px-4 py-2 text-xs font-medium text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden">
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">New</span>
          <div className="gov-marquee">
            <span>{t("marqueeText")}</span>
          </div>
        </div>
      </div>

      {/* Brand bar */}
      <div className="bg-[var(--gov-paper)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--gov-gold)] bg-white shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gov-navy)] text-sm font-black text-white">SC</div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gov-saffron)]">{t("brandGovLine")}</p>
              <h1 className="font-serif text-2xl font-bold text-[var(--gov-navy)]">{t("brandName")}</h1>
              <p className="text-xs text-muted-foreground">{t("brandTagline")}</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-xl border border-[var(--gov-border)] bg-white px-4 py-2 text-right shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gov-green)]">{t("nationalService")}</p>
              <p className="text-xs text-muted-foreground">{t("secureInterface")}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full border border-[var(--gov-border)] bg-white">
              <Bell className="h-4 w-4 text-[var(--gov-navy)]" />
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-[var(--gov-border)] bg-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0" aria-describedby="mobile-nav-description">
              <SheetTitle className="sr-only">Government Portal Navigation</SheetTitle>
              <SheetDescription id="mobile-nav-description" className="sr-only">Open the main sections of SchemeConnect.</SheetDescription>
              <div className="h-full bg-[var(--gov-paper)]">
                <div className="gov-tricolor-stripe" />
                <div className="border-b border-[var(--gov-border)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">SchemeConnect</p>
                  <p className="mt-2 text-sm text-muted-foreground">Official-style citizen service navigation</p>
                  {/* Mobile language switcher */}
                  <div className="mt-3 flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code)}
                        className={cn(
                          "rounded-md border px-3 py-1 text-xs font-semibold transition-colors",
                          locale === lang.code
                            ? "border-[var(--gov-navy)] bg-[var(--gov-navy)] text-white"
                            : "border-[var(--gov-border)] bg-white text-[var(--gov-navy)] hover:bg-[var(--gov-paper-strong)]"
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <nav className="p-4">
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.href}
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
                      <Button className="w-full gov-button-primary" onClick={handleLogout}>{t("logout")}</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full gov-button-primary">{t("loginCitizen")}</Button>
                      </Link>
                      <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-[var(--gov-border)] bg-white">{t("loginAdmin")}</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop nav */}
      <div className="hidden border-t border-[var(--gov-border)] bg-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("gov-nav-link", pathname === item.href && "gov-nav-link-active")}
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
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/admin/login">
                  <Button variant="ghost" className="text-[var(--gov-navy)]">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {t("loginAdmin")}
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="gov-button-primary">
                    <UserRound className="mr-2 h-4 w-4" />
                    {t("loginCitizen")}
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