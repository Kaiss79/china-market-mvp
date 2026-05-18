import "./globals.css";
import Link from "next/link";
import CartCount from "./components/CartCount";
import FloatingAI from "./components/FloatingAI";

export const metadata = {
  title: "China Market — AI Marketplace",
  description: "Умный маркетплейс товаров из Китая с AI-поиском",
};

const CATEGORIES = [
  { label: "Электроника", icon: "📱", slug: "Электроника" },
  { label: "Гаджеты", icon: "🎧", slug: "Гаджеты" },
  { label: "Авто", icon: "🚗", slug: "Авто" },
  { label: "Дом", icon: "🏠", slug: "Дом" },
  { label: "Одежда", icon: "👕", slug: "Одежда" },
  { label: "Красота", icon: "💄", slug: "Красота" },
  { label: "Спорт", icon: "⚽", slug: "Спорт" },
  { label: "Инструменты", icon: "🔧", slug: "Инструменты" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <header className="site-header">
          <div className="header-top">
            <Link href="/" className="site-logo">
              🛒 <span>China Market</span>
            </Link>

            <div className="header-search-wrap">
              <form action="/" method="GET" className="header-search">
                <input name="search" placeholder="🔍 Поиск товаров, брендов, категорий..." />
                <button type="submit">Найти</button>
              </form>
            </div>

            <div className="header-actions">
              <Link href="/wishlist" className="header-icon-btn" title="Избранное">
                🤍
              </Link>
              <Link href="/cart" className="header-cart-btn">
                🛒 Корзина
                <CartCount />
              </Link>
              <Link href="/seller/register" className="header-sell-btn">
                Продавать
              </Link>
            </div>
          </div>

          <nav className="header-nav">
            <div className="header-nav-inner">
              <Link href="/">Главная</Link>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/?category=${encodeURIComponent(c.slug)}`}>
                  {c.icon} {c.label}
                </Link>
              ))}
              <Link href="/support">Поддержка</Link>
              <Link href="/admin" className="admin-nav-link">Админ</Link>
            </div>
          </nav>
        </header>

        <main className="site-main">
          {children}
        </main>

        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">🛒 China Market</div>
              <p>AI-маркетплейс товаров из Китая. Лучшие цены, проверенные продавцы, быстрая доставка.</p>
            </div>
            <div>
              <strong>Покупателям</strong>
              <Link href="/">Каталог</Link>
              <Link href="/cart">Корзина</Link>
              <Link href="/wishlist">Избранное</Link>
              <Link href="/checkout">Оформить заказ</Link>
              <Link href="/support">Поддержка</Link>
            </div>
            <div>
              <strong>Продавцам</strong>
              <Link href="/seller/register">Регистрация</Link>
              <Link href="/seller/dashboard">Dashboard</Link>
              <Link href="/seller/products">Мои товары</Link>
            </div>
            <div>
              <strong>Платформа</strong>
              <Link href="/admin">Админ-панель</Link>
              <Link href="/admin/orders">Заказы</Link>
              <Link href="/admin/sellers">Продавцы</Link>
              <Link href="/admin/support">Поддержка</Link>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 China Market MVP · AI Marketplace · Работает на Next.js + Prisma
          </div>
        </footer>

        <FloatingAI />
      </body>
    </html>
  );
}
