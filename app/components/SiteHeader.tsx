"use client";

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

export default function SiteHeader() {
  const { t, lang, currency, setLang, setCurrency } = useSettings();

  return (
    <header className="site-header">
      {/* Top bar: logo + search + actions */}
      <div className="header-top">
        <Link href="/" className="site-logo">
          🛒 <span>China Market</span>
        </Link>

        <div className="header-search-wrap">
          <form action="/" method="GET" className="header-search">
            <input name="search" placeholder={t("nav.search_placeholder")} />
            <button type="submit">{t("nav.search_btn")}</button>
          </form>
        </div>

        <div className="header-actions">
          <Link href="/wishlist" className="header-icon-btn" title={t("nav.wishlist")}>🤍</Link>
          <Link href="/cart" className="header-cart-btn">
            🛒 {t("nav.cart")}<CartCount />
          </Link>
          <Link href="/seller/register" className="header-sell-btn">{t("nav.seller")}</Link>
        </div>
      </div>

      {/* Nav bar: categories + language/currency selects */}
      <nav className="header-nav">
        <div className="header-nav-inner">
          <Link href="/">{t("nav.home")}</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/?category=${encodeURIComponent(c.slug)}`}>
              {c.icon} {t(c.labelKey)}
            </Link>
          ))}
          <Link href="/sell" className="sell-nav-link">🏪 {t("nav.seller")}</Link>
          <Link href="/support">{t("nav.support")}</Link>
          <Link href="/admin" className="admin-nav-link">{t("nav.admin")}</Link>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Language switcher */}
          <div className="nav-switcher">
            <span className="nav-sw-icon">🌐</span>
            <select
              className="nav-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.code.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Currency switcher */}
          <div className="nav-switcher">
            <span className="nav-sw-icon">💱</span>
            <select
              className="nav-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
}
