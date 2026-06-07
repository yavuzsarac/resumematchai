"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "en" | "tr";

interface LanguageContextValue {
  locale: Locale;
  isTurkish: boolean;
  setLocale: (locale: Locale) => void;
  text: (english: string, turkish: string) => string;
  formatDate: (value: string, withTime?: boolean) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "resumematch_locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "tr" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => {
    function setLocale(nextLocale: Locale) {
      setLocaleState(nextLocale);
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    }

    return {
      locale,
      isTurkish: locale === "tr",
      setLocale,
      text: (english, turkish) => (locale === "tr" ? turkish : english),
      formatDate: (dateValue, withTime = false) =>
        new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
          dateStyle: "medium",
          ...(withTime ? { timeStyle: "short" } : {}),
        }).format(new Date(dateValue)),
    };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider.");
  return context;
}

