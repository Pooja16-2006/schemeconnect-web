"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, Shield, User, Bell, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Check Eligibility", href: "/eligibility" },
  { name: "Track Application", href: "/track" },
  { name: "All Schemes", href: "/schemes" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden border-b border-border/30 bg-primary/5 sm:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            <span>A Digital India Initiative</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Skip to main content</span>
            <span>Screen Reader Access</span>
          </div>
        </div>
      </div>
      
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5 text-primary-foreground" />
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
              SchemeConnect
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Government of India
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-medium transition-all",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.name}
              {pathname === item.href && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative hidden sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link href="/admin" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2 shadow-sm">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0" aria-describedby="mobile-nav-description">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription id="mobile-nav-description" className="sr-only">
                Navigate to different sections of SchemeConnect
              </SheetDescription>
              <div className="flex h-full flex-col">
                {/* Sheet Header */}
                <div className="border-b p-6">
                  <Link
                    href="/"
                    className="flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
                      <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold">SchemeConnect</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Government of India
                      </span>
                    </div>
                  </Link>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.name}
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    ))}
                  </div>
                </nav>
                
                {/* Sheet Footer */}
                <div className="border-t p-4">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full gap-2">
                      <User className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
