"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSettings } from "./SettingsProvider";
import CartCount from "./CartCount";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { CURRENCIES, type Currency } from "@/lib/currency";

const CATEGORIES = [
  { labelKey: "cat.electronics", icon: "📱", slug: "Электроника" },
  { labelKey: "cat.gadgets", icon: "🎧", slug: "Гаджеты" },
  { labelKey: "cat.auto", icon: "🚗", slug: "Авто" },
  { labelKey: "cat.home", icon: "🏠", slug: "Дом" },
  { labelKey: "cat.clothes", icon: "👕", slug: "Одежда" },
  { labelKey: "cat.beauty", icon: "💄", slug: "Красота" },
  { labelKey: "cat.sport", icon: "⚽", slug: "Спорт" },
  { labelKey: "cat.tools", icon: "🔧", slug: "Инструменты" },
];

function Dropdown<T extends string>({
  icon,
  current,
  options,
  onSelect,
  renderOption,
  renderCurrent,
}: {
  icon: string;
  current: T;
  options: { code: T; label: string; flag?: string; symbol?: string }[];
  onSelect: (v: T) => void;
  renderOption: (o: { code: T; label: string; flag?: string; symbol?: string }) => React.ReactNode;
  renderCurrent: () => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="sw-dropdown" ref={ref}>
      <button className="sw-btn" onClick={() => setOpen((o) => !o)} type="button">
        <span>{icon}</span>
        {renderCurrent()}
        <span className="sw-arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="sw-menu">
          {options.map((opt) => (
            <button
              key={opt.code}
              className={`sw-item${opt.code === current ? " active" : ""}`}
              onClick={() => { onSelect(opt.code); setOpen(false); }}
              type="button"
            >
              {renderOption(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const { t, lang, currency, setLang, setCurrency } = useSettings();
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="site-header">
      <div className="header-top">
        <Link href="/" className="site-logo">
          🛒 <span>China Market</span>
        </Link>

        <div className="header-search-wrap">
          <form action="/" method="GET" className="header-search">
            <input
              name="search"
              placeholder={t("nav.search_placeholder")}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit">{t("nav.search_btn")}</button>
          </form>
        </div>

        <div className="header-actions">
          {/* Language + Currency switchers */}
          <div className="sw-group">
            <Dropdown<Lang>
              icon="🌐"
              current={lang}
              options={LANGUAGES}
              onSelect={setLang}
              renderCurrent={() => <span>{lang.toUpperCase()}</span>}
              renderOption={(o) => (
                <>
                  <span>{o.flag}</span>
                  <span>{o.label}</span>
                </>
              )}
            />
            <Dropdown<Currency>
              icon="💱"
              current={currency}
              options={CURRENCIES.map((c) => ({ code: c.code, label: c.label, symbol: c.symbol }))}
              onSelect={setCurrency}
              renderCurrent={() => <span>{currency}</span>}
              renderOption={(o) => (
                <>
                  <span className="sw-symbol">{o.symbol}</span>
                  <span>{o.code}</span>
                </>
              )}
            />
          </div>

          <Link href="/wishlist" className="header-icon-btn" title={t("nav.wishlist")}>
            🤍
          </Link>
          <Link href="/cart" className="header-cart-btn">
            🛒 {t("nav.cart")}
            <CartCount />
          </Link>
          <Link href="/seller/register" className="header-sell-btn">
            {t("nav.seller")}
          </Link>
        </div>
      </div>

      <nav className="header-nav">
        <div className="header-nav-inner">
          <Link href="/">{t("nav.home")}</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/?category=${encodeURIComponent(c.slug)}`}>
              {c.icon} {t(c.labelKey)}
            </Link>
          ))}
          <Link href="/support">{t("nav.support")}</Link>
          <Link href="/admin" className="admin-nav-link">{t("nav.admin")}</Link>
        </div>
      </nav>
    </header>
  );
}
