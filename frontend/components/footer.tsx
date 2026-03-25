import Link from "next/link";
import { Shield, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  services: [
    { name: "Check Eligibility", href: "/eligibility" },
    { name: "Track Application", href: "/track" },
    { name: "All Schemes", href: "/schemes" },
    { name: "FAQ", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Feedback", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "RTI", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight">
                  SchemeConnect
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Government of India
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A digital initiative to help citizens discover and access
              government welfare schemes. Empowering India, one scheme at a
              time.
            </p>
            
            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <a href="mailto:support@schemeconnect.gov.in" className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Mail className="h-4 w-4" />
                support@schemeconnect.gov.in
              </a>
              <a href="tel:1800-111-555" className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Phone className="h-4 w-4" />
                1800-111-555 (Toll Free)
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Ministry of Electronics and IT,<br />Electronics Niketan, New Delhi - 110003</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-2xl border bg-muted/30 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get notified about new schemes and important updates
              </p>
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                type="email"
                className="h-11 w-full bg-background sm:w-64"
              />
              <Button className="h-11 shadow-md shadow-primary/20">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SchemeConnect. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              A Digital India Initiative
            </span>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <span>Ministry of Electronics and IT</span>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
