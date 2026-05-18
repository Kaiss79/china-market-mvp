"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, DEFAULT_LANG, getT } from "@/lib/i18n";
import { Currency, DEFAULT_CURRENCY, formatCurrency } from "@/lib/currency";

type SettingsContextType = {
  lang: Lang;
  currency: Currency;
  setLang: (lang: Lang) => void;
  setCurrency: (currency: Currency) => void;
  t: (key: string) => string;
  formatPrice: (amountKopecks: number) => string;
};

const SettingsContext = createContext<SettingsContextType>({
  lang: DEFAULT_LANG,
  currency: DEFAULT_CURRENCY,
  setLang: () => {},
  setCurrency: () => {},
  t: (k) => k,
  formatPrice: (a) => `${(a / 100).toFixed(2)} ₴`,
});

export function useSettings() {
  return useContext(SettingsContext);
}

export default function SettingsProvider({
  children,
  initialLang = DEFAULT_LANG,
  initialCurrency = DEFAULT_CURRENCY,
}: {
  children: ReactNode;
  initialLang?: Lang;
  initialCurrency?: Currency;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  useEffect(() => {
    // Sync currency from localStorage on mount (client-side override)
    const stored = localStorage.getItem("selectedCurrency") as Currency | null;
    if (stored && ["UAH", "USD", "EUR", "RUB", "RON", "CNY"].includes(stored)) {
      setCurrencyState(stored);
    }
  }, []);

  function setLang(newLang: Lang) {
    // Persist to cookie and reload so server components re-render in new language
    document.cookie = `china_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("selectedLanguage", newLang);
    window.location.reload();
  }

  function setCurrency(newCurrency: Currency) {
    setCurrencyState(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
    // Also cookie so server-initial render matches
    document.cookie = `china_currency=${newCurrency}; path=/; max-age=31536000; SameSite=Lax`;
  }

  const t = getT(lang);
  const formatPrice = (amountKopecks: number) => formatCurrency(amountKopecks, currency);

  return (
    <SettingsContext.Provider value={{ lang, currency, setLang, setCurrency, t, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  );
}
