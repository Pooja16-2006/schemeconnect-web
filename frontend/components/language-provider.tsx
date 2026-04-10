"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Locale, translations } from "@/lib/i18n";

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => translations.en[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("sc_locale") as Locale;
    if (saved && ["en", "hi", "kn"].includes(saved)) setLocaleState(saved);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("sc_locale", l);
  }

  function t(key: keyof typeof translations.en): string {
    return translations[locale][key] ?? translations.en[key];
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}


export const useLanguage = () => useContext(LanguageContext);