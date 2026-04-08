import Link from "next/link";
import { Building2, ExternalLink, Landmark, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  citizen: [
    { name: "Check Eligibility", href: "/eligibility" },
    { name: "Browse Schemes", href: "/schemes" },
    { name: "Citizen Login", href: "/auth" },
  ],
  portal: [
    { name: "Accessibility Statement", href: "#" },
    { name: "Terms of Use", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
  governance: [
    { name: "Digital India", href: "#" },
    { name: "MeitY", href: "#" },
    { name: "National Informatics Centre", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--gov-border)] bg-[var(--gov-navy)] text-white">
      <div className="gov-tricolor-stripe" />

      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 text-sm sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-[var(--gov-gold)]" />
            <span>Citizen-facing welfare information portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[var(--gov-gold)]" />
            <span>Designed with official portal patterns for trust and clarity</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[var(--gov-gold)]" />
            <span>Public grievance helpline support references included scheme-wise</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--gov-gold)] bg-white text-[var(--gov-navy)] shadow-sm">
                <span className="text-lg font-black">SC</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gov-saffron)]">भारत सरकार | Government of India</p>
                <h2 className="font-serif text-2xl font-bold">SchemeConnect</h2>
                <p className="text-sm text-white/70">Public welfare discovery and official portal guidance</p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
              SchemeConnect helps citizens understand eligibility, prepare the right documents, and navigate to the official government portal for final application submission. It is designed as a guidance layer, not a replacement for official approval systems.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/75">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--gov-gold)]" />
                <span>Ministry of Electronics and Information Technology, Government of India, New Delhi - 110003</span>
              </div>
              <a href="mailto:support@schemeconnect.gov.in" className="flex items-center gap-3 hover:text-white">
                <Mail className="h-4 w-4 text-[var(--gov-gold)]" />
                support@schemeconnect.gov.in
              </a>
              <a href="tel:1800-111-555" className="flex items-center gap-3 hover:text-white">
                <Phone className="h-4 w-4 text-[var(--gov-gold)]" />
                1800-111-555
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gov-gold)]">Citizen Services</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.citizen.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white">
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gov-gold)]">Portal Policies</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.portal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white">
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gov-gold)]">Government Links</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.governance.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white">
                    {link.name}
                    <ExternalLink className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/75">
          <p className="font-semibold text-white">Important</p>
          <p className="mt-2">
            Citizens should always complete final application submission on the official government website or through the notified authority. SchemeConnect provides guidance, checklists, and readiness support only.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SchemeConnect. Government-style citizen service interface.</p>
          <p>Domain reference style: `.gov.in` public service pattern | Ministry attribution included for civic clarity</p>
        </div>
      </div>
    </footer>
  );
}
