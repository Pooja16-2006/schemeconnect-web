"use client";

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CitizenAuthGuard } from "@/components/citizen-auth-guard";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFallbackEligibilityResponse, mapEligibilityResultsToSchemes, type SchemeViewModel } from "@/lib/portal-data";
import { schemeDetailRecords, schemeDetailsById, type SchemeDetailRecord } from "@/lib/scheme-detail-data";
import type { Locale } from "@/lib/i18n";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Copy,
  ExternalLink,
  FileText,
  IndianRupee,
  Landmark,
  Phone,
  Users,
} from "lucide-react";

function getStoredSchemes(locale: Locale) {
  if (typeof window === "undefined") {
    return mapEligibilityResultsToSchemes(getFallbackEligibilityResponse(), locale);
  }

  try {
    const raw = sessionStorage.getItem("eligibilityResults");
    if (!raw) {
      return mapEligibilityResultsToSchemes(getFallbackEligibilityResponse(), locale);
    }

    return mapEligibilityResultsToSchemes(JSON.parse(raw), locale);
  } catch {
    return mapEligibilityResultsToSchemes(getFallbackEligibilityResponse(), locale);
  }
}

function localizeSchemeDetail(detail: SchemeDetailRecord, locale: Locale) {
  if (detail.id !== "3") {
    return detail;
  }

  if (locale === "hi") {
    return {
      ...detail,
      benefitSummary: "परिवार के लिए प्रति वर्ष रु. 5 लाख तक स्वास्थ्य कवर।",
      beneficiaries: "अस्पताल सहायता की आवश्यकता वाले प्राथमिक और पात्र परिवार",
      benefits: [
        { title: "कैशलेस उपचार", description: "पात्र परिवार बिना अग्रिम भुगतान के पैनल अस्पतालों में उपचार पा सकते हैं।" },
        { title: "उच्च वार्षिक कवर", description: "अस्पताल में भर्ती के लिए परिवार को प्रति वर्ष रु. 5 लाख तक कवर मिलता है।" },
        { title: "व्यापक अस्पताल नेटवर्क", description: "पब्लिक और प्राइवेट पैनल अस्पतालों में उपचार उपलब्ध है।" },
      ],
      eligibility: [
        { label: "परिवार पात्र लाभार्थी डेटाबेस में होना चाहिए", metByDefault: true },
        { label: "पहचान विवरण आधार या परिवार रिकॉर्ड से मेल खाना चाहिए", metByDefault: true },
        { label: "परिवार श्रेणी को आधिकारिक समावेशन मानदंड पूरे करने चाहिए", metByDefault: true },
      ],
      documents: [
        { name: "आधार कार्ड", required: true, purpose: "लाभार्थी खोज और ई-कार्ड निर्माण के दौरान पहचान मिलान के लिए।" },
        { name: "राशन कार्ड", required: true, purpose: "परिवार और गृहस्थ रिकॉर्ड सत्यापन में सहायक।" },
        { name: "फैमिली आईडी", required: true, purpose: "योजना डेटाबेस में सदस्यों का सत्यापन करने में मदद।" },
        { name: "मोबाइल नंबर", required: false, purpose: "OTP सत्यापन और सूचनाओं के लिए उपयोगी।" },
      ],
      applicationSteps: [
        "लाभार्थी पोर्टल खोलें और देखें कि आपका परिवार आधिकारिक डेटाबेस में है या नहीं।",
        "आधार या परिवार रिकॉर्ड से पहचान विवरण सत्यापित करें।",
        "अधिकृत प्रक्रिया से आयुष्मान कार्ड बनाएँ या अपडेट करें।",
        "उपचार की आवश्यकता होने पर पैनल अस्पताल में कार्ड का उपयोग करें।",
      ],
      processingNote: "ऑनलाइन सत्यापन रुकने पर CSC या पैनल अस्पतालों के माध्यम से भी कार्ड निर्माण किया जा सकता है।",
    };
  }

  if (locale === "kn") {
    return {
      ...detail,
      benefitSummary: "ಒಂದು ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ರೂ. 5 ಲಕ್ಷದವರೆಗೆ ಆರೋಗ್ಯ ಕವರ್.",
      beneficiaries: "ಆಸ್ಪತ್ರೆ ಸಹಾಯ ಅಗತ್ಯವಿರುವ ಪ್ರಾಥಮಿಕ ಮತ್ತು ಅರ್ಹ ಕುಟುಂಬಗಳು",
      benefits: [
        { title: "ನಗದುರಹಿತ ಚಿಕಿತ್ಸೆ", description: "ಅರ್ಹ ಕುಟುಂಬಗಳು ಪ್ಯಾನೆಲ್ ಆಸ್ಪತ್ರೆಗೆ ಮುಂಗಡ ಪಾವತಿಸದೆ ಚಿಕಿತ್ಸೆ ಪಡೆಯಬಹುದು." },
        { title: "ಉನ್ನತ ವಾರ್ಷಿಕ ಕವರ್", description: "ಆಸ್ಪತ್ರೆ ಚಿಕಿತ್ಸೆಗೆ ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ರೂ. 5 ಲಕ್ಷದವರೆಗೆ ಕವರ್ ಸಿಗುತ್ತದೆ." },
        { title: "ವ್ಯಾಪಕ ಆಸ್ಪತ್ರೆ ಜಾಲ", description: "ಸರ್ಕಾರಿ ಮತ್ತು ಖಾಸಗಿ ಪ್ಯಾನೆಲ್ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಚಿಕಿತ್ಸೆ ಲಭ್ಯ." },
      ],
      eligibility: [
        { label: "ಕುಟುಂಬವು ಅರ್ಹ ಫಲಾನುಭವಿಗಳ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಇರಬೇಕು", metByDefault: true },
        { label: "ಗುರುತು ವಿವರಗಳು ಆಧಾರ್ ಅಥವಾ ಕುಟುಂಬ ದಾಖಲೆಗಳಿಗೆ ಹೊಂದಬೇಕು", metByDefault: true },
        { label: "ಕುಟುಂಬ ವರ್ಗವು ಅಧಿಕೃತ ಒಳಗೊಂಡಿಕೆ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸಬೇಕು", metByDefault: true },
      ],
      documents: [
        { name: "ಆಧಾರ್ ಕಾರ್ಡ್", required: true, purpose: "ಫಲಾನುಭವಿ ಪರಿಶೀಲನೆ ಮತ್ತು ಇ-ಕಾರ್ಡ್ ಸೃಷ್ಟಿಗೆ ಗುರುತು ಹೊಂದಾಣಿಕೆಗಾಗಿ." },
        { name: "ರೇಷನ್ ಕಾರ್ಡ್", required: true, purpose: "ಕುಟುಂಬ ಹಾಗೂ ಗೃಹ ದಾಖಲೆ ಪರಿಶೀಲನೆಗೆ ಸಹಾಯಕ." },
        { name: "ಫ್ಯಾಮಿಲಿ ಐಡಿ", required: true, purpose: "ಯೋಜನೆ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಸದಸ್ಯರ ಮಾನ್ಯತೆಗಾಗಿ ಸಹಾಯ." },
        { name: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", required: false, purpose: "OTP ಪರಿಶೀಲನೆ ಮತ್ತು ಸೂಚನೆಗಳಿಗೆ ಉಪಯುಕ್ತ." },
      ],
      applicationSteps: [
        "ಫಲಾನುಭವಿಗಳ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬ ಅಧಿಕೃತ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಇದೆಯೇ ನೋಡಿ.",
        "ಆಧಾರ್ ಅಥವಾ ಕುಟುಂಬ ದಾಖಲೆಗಳೊಂದಿಗೆ ಗುರುತು ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
        "ಅಧಿಕೃತ ಪ್ರಕ್ರಿಯೆಯ ಮೂಲಕ ಆಯುಷ್ಮಾನ್ ಕಾರ್ಡ್ ರಚಿಸಿ ಅಥವಾ ನವೀಕರಿಸಿ.",
        "ಚಿಕಿತ್ಸೆ ಅಗತ್ಯವಿರುವಾಗ ಪ್ಯಾನೆಲ್ ಆಸ್ಪತ್ರೆಗೆ ಕಾರ್ಡ್ ಬಳಸಿ.",
      ],
      processingNote: "ಆನ್‌ಲೈನ್ ಪರಿಶೀಲನೆ ವಿಳಂಬವಾದರೆ CSC ಅಥವಾ ಪ್ಯಾನೆಲ್ ಆಸ್ಪತ್ರೆಗೆ ಮೂಲಕವೂ ಕಾರ್ಡ್ ಸೃಷ್ಟಿ ಮಾಡಬಹುದು.",
    };
  }

  return detail;
}

function mergeSchemeData(detail: SchemeDetailRecord, viewModel?: SchemeViewModel) {
  return {
    ...detail,
    eligibilityScore: viewModel?.eligibilityScore ?? 87,
    benefitsText: viewModel?.benefits ?? detail.benefitSummary,
    deadlineText: viewModel?.deadline ?? detail.deadline,
    documentsPreview: viewModel?.documents ?? detail.documents.map((document) => document.name),
    nextSteps: viewModel?.nextSteps ?? detail.applicationSteps,
    reasons: viewModel?.reasons ?? [],
  };
}

export default function SchemeDetailPage() {
  const { locale, t } = useLanguage();
  const params = useParams<{ id: string }>();
  const schemeId = typeof params?.id === "string" ? params.id : "";
  const [schemes, setSchemes] = useState<SchemeViewModel[]>([]);
  const [copied, setCopied] = useState(false);
  const [checkedDocuments, setCheckedDocuments] = useState<string[]>([]);

  useEffect(() => {
    setSchemes(getStoredSchemes(locale));
  }, [locale]);

  const detail = localizeSchemeDetail(schemeDetailsById[schemeId] ?? schemeDetailRecords[0], locale);
  const scheme = schemes.find((item) => item.id === schemeId);
  const data = useMemo(() => mergeSchemeData(detail, scheme), [detail, scheme]);

  const relatedSchemes = useMemo(
    () =>
      schemeDetailRecords
        .filter((item) => item.id !== data.id && (item.category === data.category || item.state === data.state))
        .slice(0, 3),
    [data],
  );

  function toggleDocument(name: string) {
    setCheckedDocuments((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  }

  async function copyOfficialLink() {
    try {
      await navigator.clipboard.writeText(data.officialUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <CitizenAuthGuard>
        <main className="flex-1">
        <section className="gov-page-hero">
          <div className="gov-tricolor-stripe" />
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-[var(--gov-navy)]">{t("navHome")}</Link>
              <span className="mx-2 text-[var(--gov-saffron)]">/</span>
              <Link href="/schemes" className="hover:text-[var(--gov-navy)]">{t("navSchemes")}</Link>
              <span className="mx-2 text-[var(--gov-saffron)]">/</span>
              {data.name}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link href="/schemes">
                <Button variant="outline" className="border-[var(--gov-border)] bg-white gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("schemeDetailBack")}
                </Button>
              </Link>
              {schemeDetailRecords.map((item) => (
                <Link key={item.id} href={`/schemes/${item.id}`}>
                  <Badge variant={item.id === data.id ? "default" : "outline"} className="whitespace-nowrap px-3 py-1.5">
                    {item.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="gov-section-label">{t("schemeDetailReference")}</div>
                <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-[var(--gov-navy)] sm:text-5xl">
                  {data.name}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                  {scheme?.description || t("schemeDetailFallbackDescription")}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="gov-card rounded-3xl p-5">
                    <IndianRupee className="h-5 w-5 text-[var(--gov-saffron)]" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">{t("schemeDetailBenefit")}</p>
                    <p className="mt-2 font-semibold text-[var(--gov-navy)]">{data.benefitsText}</p>
                  </div>
                  <div className="gov-card rounded-3xl p-5">
                    <Calendar className="h-5 w-5 text-[var(--gov-green)]" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">{t("schemeDetailActiveSince")}</p>
                    <p className="mt-2 font-semibold text-[var(--gov-navy)]">{data.activeSince}</p>
                  </div>
                  <div className="gov-card rounded-3xl p-5">
                    <Users className="h-5 w-5 text-[var(--gov-navy)]" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gov-saffron)]">{t("schemeDetailBeneficiaries")}</p>
                    <p className="mt-2 font-semibold text-[var(--gov-navy)]">{data.beneficiaries}</p>
                  </div>
                </div>
              </div>

              <div className="lg:pl-6">
                <Card className="gov-card sticky top-24 overflow-hidden rounded-[2rem] border-0">
                  <CardHeader className="bg-[var(--gov-navy)] text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white/75">{t("schemeDetailEligibilityMatch")}</p>
                        <CardTitle className="mt-2 text-4xl">{data.eligibilityScore}%</CardTitle>
                      </div>
                      <BadgeCheck className="h-10 w-10 text-[var(--gov-gold)]" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 bg-[var(--gov-paper)] p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("schemeDetailDeadline")}</span>
                        <span className="font-medium text-[var(--gov-navy)]">{data.deadlineText}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("schemeDetailMinistry")}</span>
                        <span className="font-medium text-[var(--gov-navy)]">{data.ministry}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t("schemeDetailHelpline")}</span>
                        <span className="font-medium text-[var(--gov-navy)]">{data.helpline}</span>
                      </div>
                    </div>

                    <a href={data.officialUrl} target="_blank" rel="noreferrer">
                      <Button className="gov-button-primary w-full justify-between">
                        {t("schemeDetailApplyOfficial")}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>

                    <Button variant="outline" className="w-full justify-between border-[var(--gov-border)] bg-white" onClick={copyOfficialLink}>
                      {copied ? t("schemeDetailCopied") : t("schemeDetailCopy")}
                      <Copy className="h-4 w-4" />
                    </Button>

                    <div className="rounded-2xl border border-[var(--gov-border)] bg-white p-4 text-sm text-slate-600">
                      {data.disclaimer}
                    </div>

                    <div className="grid gap-3 text-sm">
                      <div className="gov-info-row">
                        <Landmark className="mt-0.5 h-4 w-4 text-[var(--gov-saffron)]" />
                        <div>
                          <p className="font-medium text-[var(--gov-navy)]">{t("schemeDetailOfficialPortal")}</p>
                          <p className="text-muted-foreground">{data.portalLabel}</p>
                        </div>
                      </div>
                      <div className="gov-info-row">
                        <Phone className="mt-0.5 h-4 w-4 text-[var(--gov-saffron)]" />
                        <div>
                          <p className="font-medium text-[var(--gov-navy)]">{t("schemeDetailHelp")}</p>
                          <p className="text-muted-foreground">{data.helpline}</p>
                        </div>
                      </div>
                      <div className="gov-info-row">
                        <Building2 className="mt-0.5 h-4 w-4 text-[var(--gov-saffron)]" />
                        <div>
                          <p className="font-medium text-[var(--gov-navy)]">{t("schemeDetailOfficialLink")}</p>
                          <a className="break-all text-[var(--gov-navy)] underline-offset-4 hover:underline" href={data.officialUrl} target="_blank" rel="noreferrer">
                            {data.officialUrl}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[var(--gov-navy)]">{t("schemeDetailYouMayAlsoQualify")}</p>
                      <div className="mt-3 space-y-3">
                        {relatedSchemes.map((item) => (
                          <Link key={item.id} href={`/schemes/${item.id}`} className="block rounded-2xl border border-[var(--gov-border)] bg-white p-4 transition-colors hover:bg-[var(--gov-paper-strong)]">
                            <p className="font-medium text-[var(--gov-navy)]">{item.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{item.benefitSummary}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div className="space-y-8">
              <Card className="gov-card rounded-[2rem] border-0">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[var(--gov-navy)]">{t("schemeDetailBenefitsBreakdown")}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {data.benefits.map((benefit) => (
                    <div key={benefit.title} className="rounded-2xl border border-[var(--gov-border)] bg-white p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gov-saffron-soft)]">
                          <IndianRupee className="h-5 w-5 text-[var(--gov-saffron)]" />
                        </div>
                        <h3 className="font-semibold text-[var(--gov-navy)]">{benefit.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{benefit.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gov-card rounded-[2rem] border-0">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[var(--gov-navy)]">{t("schemeDetailEligibilityCriteria")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.eligibility.map((item) => {
                    const isMet = item.metByDefault ?? true;
                    return (
                      <div key={item.label} className="gov-info-row">
                        {isMet ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--gov-green)]" />
                        ) : (
                          <CircleAlert className="mt-0.5 h-5 w-5 text-[var(--gov-saffron)]" />
                        )}
                        <div>
                          <p className="font-medium text-[var(--gov-navy)]">{item.label}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {isMet ? t("schemeDetailCriteriaMetText") : t("schemeDetailCriteriaReviewText")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="gov-card rounded-[2rem] border-0">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[var(--gov-navy)]">{t("schemeDetailDocumentsChecklist")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.documents.map((document) => {
                    const checked = checkedDocuments.includes(document.name);
                    return (
                      <button
                        key={document.name}
                        type="button"
                        onClick={() => toggleDocument(document.name)}
                        className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                          document.required ? "border-l-4 border-l-[var(--gov-saffron)]" : "border-[var(--gov-border)]"
                        } ${checked ? "bg-[var(--gov-green-soft)]" : "bg-white hover:bg-[var(--gov-paper-strong)]"}`}
                      >
                        {checked ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--gov-green)]" />
                        ) : (
                          <ClipboardList className="mt-0.5 h-5 w-5 text-[var(--gov-navy)]" />
                        )}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={`font-medium text-[var(--gov-navy)] ${checked ? "line-through text-muted-foreground" : ""}`}>{document.name}</p>
                            <Badge variant={document.required ? "default" : "outline"}>
                              {document.required ? t("schemeDetailMandatory") : t("schemeDetailOptional")}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{document.purpose}</p>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="gov-card rounded-[2rem] border-0">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[var(--gov-navy)]">{t("schemeDetailHowToApply")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.applicationSteps.map((step, index) => (
                    <div key={step} className="gov-info-row">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gov-navy)] text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">{step}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {data.processingNote ? (
                <Card className="gov-card rounded-3xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[var(--gov-navy)]">
                      <CircleAlert className="h-5 w-5 text-[var(--gov-saffron)]" />
                      {t("schemeDetailProcessingNote")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">{data.processingNote}</CardContent>
                </Card>
              ) : null}

              <Card className="gov-card rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="text-[var(--gov-navy)]">{t("schemeDetailQuickInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="gov-info-row">
                    <FileText className="mt-0.5 h-4 w-4 text-[var(--gov-saffron)]" />
                    <div>
                      <p className="font-medium text-[var(--gov-navy)]">{t("schemeDetailCommonDocuments")}</p>
                      <p className="text-muted-foreground">{data.documentsPreview.slice(0, 4).join(", ")}</p>
                    </div>
                  </div>
                  <div className="gov-info-row">
                    <ArrowRight className="mt-0.5 h-4 w-4 text-[var(--gov-saffron)]" />
                    <div>
                      <p className="font-medium text-[var(--gov-navy)]">{t("schemeDetailFirstNextStep")}</p>
                      <p className="text-muted-foreground">{data.nextSteps[0]}</p>
                    </div>
                  </div>
                  {data.reasons.length ? (
                    <div className="gov-info-row">
                      <CircleAlert className="mt-0.5 h-4 w-4 text-[var(--gov-saffron)]" />
                      <div>
                        <p className="font-medium text-[var(--gov-navy)]">{t("schemeDetailAttentionPoint")}</p>
                        <p className="text-muted-foreground">{data.reasons[0]}</p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        </main>
      </CitizenAuthGuard>
      <Footer />
    </div>
  );
}
