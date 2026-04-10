"use client";

import { Header } from "@/components/header";
import { CitizenAuthGuard } from "@/components/citizen-auth-guard";
import { Footer } from "@/components/footer";
import { ApplicationTracker } from "@/components/application-tracker";
import { useLanguage } from "@/components/language-provider";
import { CircleAlert, FileCheck2, Landmark, SearchCheck } from "lucide-react";

export default function TrackPage() {
  const { locale, t } = useLanguage();
  const copy = {
    en: {
      breadcrumb: "Track Status",
      sectionLabel: "Citizen Application Status",
      title: "Track Your Application Progress",
      subtitle:
        "Check where your submitted application stands, review current status, and see if any manual verification or missing documents are slowing it down.",
      cardOneTitle: "Verification steps",
      cardOneBody: "View submitted, review, and final decision stages clearly.",
      cardTwoTitle: "Application lookup",
      cardTwoBody: "Search by application ID and review the latest saved application.",
      cardThreeTitle: "Actionable alerts",
      cardThreeBody: "Spot pending documents and review flags before they turn into delays.",
      guideTitle: "Status Guide",
      guide1: "Submitted means your application has entered the queue.",
      guide2: "Under review means a department or manual review stage is active.",
      guide3: "Approved or rejected reflects the latest official outcome stored in the system.",
      helpTitle: "Help Notice",
      helpBody:
        "If your application remains under review for a long period, re-check the official scheme portal, helpline, or local authority instructions. SchemeConnect reflects stored application state but does not replace final department action.",
      monitorLabel: "Application Monitoring",
      monitorTitle: "Scheme Application Tracker",
    },
    hi: {
      breadcrumb: "स्थिति ट्रैक करें",
      sectionLabel: "नागरिक आवेदन स्थिति",
      title: "अपने आवेदन की प्रगति ट्रैक करें",
      subtitle:
        "देखें कि आपका जमा किया गया आवेदन किस स्थिति में है, वर्तमान स्टेटस की समीक्षा करें, और समझें कि कोई मैनुअल सत्यापन या लंबित दस्तावेज़ देरी तो नहीं कर रहे हैं।",
      cardOneTitle: "सत्यापन चरण",
      cardOneBody: "जमा, समीक्षा और अंतिम निर्णय चरण स्पष्ट रूप से देखें।",
      cardTwoTitle: "आवेदन खोज",
      cardTwoBody: "आवेदन आईडी से खोजें और नवीनतम सहेजा आवेदन देखें।",
      cardThreeTitle: "कार्रवाई योग्य अलर्ट",
      cardThreeBody: "लंबित दस्तावेज़ और समीक्षा फ़्लैग को देरी बनने से पहले पहचानें।",
      guideTitle: "स्थिति मार्गदर्शिका",
      guide1: "Submitted का अर्थ है आपका आवेदन कतार में प्रवेश कर चुका है।",
      guide2: "Under review का अर्थ है विभागीय या मैनुअल समीक्षा चल रही है।",
      guide3: "Approved या rejected सिस्टम में संग्रहीत नवीनतम आधिकारिक परिणाम दिखाता है।",
      helpTitle: "सहायता सूचना",
      helpBody:
        "यदि आपका आवेदन लंबे समय तक Under review रहे, तो आधिकारिक योजना पोर्टल, हेल्पलाइन या स्थानीय प्राधिकरण के निर्देश फिर से जाँचें। SchemeConnect केवल संग्रहीत स्थिति दिखाता है, अंतिम विभागीय कार्रवाई का विकल्प नहीं है।",
      monitorLabel: "आवेदन निगरानी",
      monitorTitle: "योजना आवेदन ट्रैकर",
    },
    kn: {
      breadcrumb: "ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್",
      sectionLabel: "ನಾಗರಿಕ ಅರ್ಜಿ ಸ್ಥಿತಿ",
      title: "ನಿಮ್ಮ ಅರ್ಜಿಯ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      subtitle:
        "ನೀವು ಸಲ್ಲಿಸಿದ ಅರ್ಜಿ ಯಾವ ಹಂತದಲ್ಲಿದೆ ನೋಡಿ, ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ, ಮತ್ತು ಕೈಯಾರೆ ಪರಿಶೀಲನೆ ಅಥವಾ ಬಾಕಿ ದಾಖಲೆಗಳಿಂದ ವಿಳಂಬವಾಗುತ್ತಿದೆಯೇ ತಿಳಿಯಿರಿ.",
      cardOneTitle: "ಪರಿಶೀಲನೆ ಹಂತಗಳು",
      cardOneBody: "ಸಲ್ಲಿಕೆ, ವಿಮರ್ಶೆ ಮತ್ತು ಅಂತಿಮ ನಿರ್ಧಾರ ಹಂತಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ನೋಡಿ.",
      cardTwoTitle: "ಅರ್ಜಿ ಹುಡುಕಾಟ",
      cardTwoBody: "ಅರ್ಜಿ ಐಡಿ ಮೂಲಕ ಹುಡುಕಿ ಮತ್ತು ಇತ್ತೀಚಿನ ಸಂಗ್ರಹಿತ ಅರ್ಜಿಯನ್ನು ನೋಡಿ.",
      cardThreeTitle: "ಕ್ರಮ ಕೈಗೊಳ್ಳುವ ಎಚ್ಚರಿಕೆಗಳು",
      cardThreeBody: "ಬಾಕಿ ದಾಖಲೆಗಳು ಮತ್ತು ವಿಮರ್ಶಾ ಫ್ಲಾಗ್‌ಗಳನ್ನು ವಿಳಂಬವಾಗುವ ಮೊದಲು ನೋಡಿ.",
      guideTitle: "ಸ್ಥಿತಿ ಮಾರ್ಗದರ್ಶಿ",
      guide1: "Submitted ಎಂದರೆ ನಿಮ್ಮ ಅರ್ಜಿ ಸಾಲಿನಲ್ಲಿ ಸೇರಿದೆ.",
      guide2: "Under review ಎಂದರೆ ಇಲಾಖೆಯ ಅಥವಾ ಕೈಯಾರೆ ಪರಿಶೀಲನೆ ನಡೆಯುತ್ತಿದೆ.",
      guide3: "Approved ಅಥವಾ rejected ಎಂದರೆ ವ್ಯವಸ್ಥೆಯಲ್ಲಿರುವ ಇತ್ತೀಚಿನ ಅಧಿಕೃತ ಫಲಿತಾಂಶ.",
      helpTitle: "ಸಹಾಯ ಸೂಚನೆ",
      helpBody:
        "ನಿಮ್ಮ ಅರ್ಜಿ ದೀರ್ಘಕಾಲ Under review ಆಗಿದ್ದರೆ, ಅಧಿಕೃತ ಯೋಜನೆ ಪೋರ್ಟಲ್, ಸಹಾಯವಾಣಿ ಅಥವಾ ಸ್ಥಳೀಯ ಪ್ರಾಧಿಕಾರದ ಸೂಚನೆಗಳನ್ನು ಮರುಪರಿಶೀಲಿಸಿ. SchemeConnect ಸಂಗ್ರಹಿತ ಸ್ಥಿತಿಯನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ; ಅಂತಿಮ ಇಲಾಖಾ ಕ್ರಮಕ್ಕೆ ಪರ್ಯಾಯವಲ್ಲ.",
      monitorLabel: "ಅರ್ಜಿ ಮೇಲ್ವಿಚಾರಣೆ",
      monitorTitle: "ಯೋಜನೆ ಅರ್ಜಿ ಟ್ರ್ಯಾಕರ್",
    },
  }[locale];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CitizenAuthGuard>
        <main className="flex-1">
        <section className="gov-page-hero">
          <div className="gov-tricolor-stripe" />
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-sm text-muted-foreground">
              {t("navHome")} <span className="mx-2 text-[var(--gov-saffron)]">/</span> {copy.breadcrumb}
            </p>
            <div className="mt-5 max-w-4xl">
              <div className="gov-section-label">{copy.sectionLabel}</div>
              <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-[var(--gov-navy)] sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                {copy.subtitle}
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="gov-card rounded-3xl p-5">
                <FileCheck2 className="h-5 w-5 text-[var(--gov-green)]" />
                <p className="mt-3 font-semibold text-[var(--gov-navy)]">{copy.cardOneTitle}</p>
                <p className="mt-2 text-sm text-slate-600">{copy.cardOneBody}</p>
              </div>
              <div className="gov-card rounded-3xl p-5">
                <SearchCheck className="h-5 w-5 text-[var(--gov-green)]" />
                <p className="mt-3 font-semibold text-[var(--gov-navy)]">{copy.cardTwoTitle}</p>
                <p className="mt-2 text-sm text-slate-600">{copy.cardTwoBody}</p>
              </div>
              <div className="gov-card rounded-3xl p-5">
                <CircleAlert className="h-5 w-5 text-[var(--gov-saffron)]" />
                <p className="mt-3 font-semibold text-[var(--gov-navy)]">{copy.cardThreeTitle}</p>
                <p className="mt-2 text-sm text-slate-600">{copy.cardThreeBody}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="space-y-6">
                <div className="gov-card rounded-3xl p-6">
                  <p className="gov-section-label">{copy.guideTitle}</p>
                  <div className="mt-5 space-y-4">
                    {[
                      copy.guide1,
                      copy.guide2,
                      copy.guide3,
                    ].map((item, index) => (
                      <div key={item} className="gov-info-row">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gov-navy)] text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-7 text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gov-card rounded-3xl p-6">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-[var(--gov-green)]" />
                    <h2 className="font-semibold text-[var(--gov-navy)]">{copy.helpTitle}</h2>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {copy.helpBody}
                  </p>
                </div>
              </div>

              <div className="gov-card overflow-hidden rounded-[2rem]">
                <div className="bg-[var(--gov-navy)] px-6 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{copy.monitorLabel}</p>
                  <h2 className="mt-2 text-2xl font-bold">{copy.monitorTitle}</h2>
                </div>
                <div className="p-6">
                  <ApplicationTracker />
                </div>
              </div>
            </div>
          </div>
        </section>
        </main>
      </CitizenAuthGuard>
      <Footer />
    </div>
  );
}
