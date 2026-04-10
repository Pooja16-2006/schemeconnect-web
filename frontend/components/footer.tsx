"use client";

import Link from "next/link";
import { Building2, ExternalLink, Landmark, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    citizen: [
      { name: t("footerCheckEligibility"), href: "/eligibility" },
      { name: t("footerBrowseSchemes"), href: "/schemes" },
      { name: t("footerCitizenLogin"), href: "/auth" },
    ],
    portal: [
      { name: t("footerAccessibility"), href: "#" },
      { name: t("footerTerms"), href: "#" },
      { name: t("footerPrivacy"), href: "#" },
    ],
    governance: [
      { name: "Digital India", href: "#" },
      { name: "MeitY", href: "#" },
      { name: "National Informatics Centre", href: "#" },
    ],
  };

  return (
    <footer className="mt-16 border-t border-[var(--gov-border)] bg-[var(--gov-navy)] text-white">
      <div className="gov-tricolor-stripe" />

      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 text-sm sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-[var(--gov-gold)]" />
            <span>{t("footerTopOne")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[var(--gov-gold)]" />
            <span>{t("footerTopTwo")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[var(--gov-gold)]" />
            <span>{t("footerTopThree")}</span>
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gov-saffron)]">
                  {t("brandGovLine")}
                </p>
                <h2 className="font-serif text-2xl font-bold">SchemeConnect</h2>
                <p className="text-sm text-white/70">{t("brandTagline")}</p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
              {t("footerDescription")}
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/75">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--gov-gold)]" />
                <span>{t("footerAddress")}</span>
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
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gov-gold)]">
              {t("footerCitizenServices")}
            </h3>
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
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gov-gold)]">
              {t("footerPortalPolicies")}
            </h3>
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
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gov-gold)]">
              {t("footerGovernmentLinks")}
            </h3>
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
          <p className="font-semibold text-white">{t("footerImportant")}</p>
          <p className="mt-2">{t("footerImportantBody")}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SchemeConnect. {t("footerCopyright")}</p>
          <p>{t("footerDomainNote")}</p>
        </div>
      </div>
    </footer>
  );
}
