import "./globals.css";
import { cookies } from "next/headers";
import Link from "next/link";
import FloatingAI from "./components/FloatingAI";
import SettingsProvider from "./components/SettingsProvider";
import SiteHeader from "./components/SiteHeader";
import { DEFAULT_LANG, getT, type Lang } from "@/lib/i18n";
import { DEFAULT_CURRENCY, type Currency } from "@/lib/currency";

export const metadata = {
  title: "China Market — AI Marketplace",
  description: "Умный маркетплейс товаров из Китая с AI-поиском",
};

const VALID_LANGS: Lang[] = ["ru", "uk", "en", "ro", "de", "zh"];
const VALID_CURRENCIES: Currency[] = ["UAH", "USD", "EUR", "RUB", "RON", "CNY"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = cookies();
  const rawLang = jar.get("china_lang")?.value ?? DEFAULT_LANG;
  const rawCurrency = jar.get("china_currency")?.value ?? DEFAULT_CURRENCY;
  const lang: Lang = VALID_LANGS.includes(rawLang as Lang) ? (rawLang as Lang) : DEFAULT_LANG;
  const currency: Currency = VALID_CURRENCIES.includes(rawCurrency as Currency)
    ? (rawCurrency as Currency)
    : DEFAULT_CURRENCY;

  const t = getT(lang);

  return (
    <html lang={lang}>
      <body>
        <SettingsProvider initialLang={lang} initialCurrency={currency}>
          <SiteHeader />

          <main className="site-main">
            {children}
          </main>

          <footer className="site-footer">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="footer-logo">🛒 China Market</div>
                <p>{t("footer.desc")}</p>
              </div>
              <div>
                <strong>{t("footer.buyers")}</strong>
                <Link href="/">{t("footer.catalog")}</Link>
                <Link href="/cart">{t("footer.cart")}</Link>
                <Link href="/wishlist">{t("footer.wishlist")}</Link>
                <Link href="/checkout">{t("footer.checkout")}</Link>
                <Link href="/support">{t("footer.support")}</Link>
              </div>
              <div>
                <strong>{t("footer.sellers")}</strong>
                <Link href="/seller/register">{t("footer.register")}</Link>
                <Link href="/seller/dashboard">{t("footer.dashboard")}</Link>
                <Link href="/seller/products">{t("footer.my_products")}</Link>
              </div>
              <div>
                <strong>{t("footer.platform")}</strong>
                <Link href="/admin">{t("footer.admin")}</Link>
                <Link href="/admin/orders">{t("footer.orders")}</Link>
                <Link href="/admin/sellers">{t("footer.sellers_list")}</Link>
                <Link href="/admin/support">{t("footer.support")}</Link>
              </div>
            </div>
            <div className="footer-bottom">
              {t("footer.copyright")}
            </div>
          </footer>
        </SettingsProvider>

        <FloatingAI />
      </body>
    </html>
  );
}
