export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { DEFAULT_LANG, getT, type Lang } from "@/lib/i18n";
import SearchBar from "./SearchBar";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./components/WishlistButton";
import AIAssistant from "./components/AIAssistant";
import Price from "./components/Price";

const VALID_LANGS: Lang[] = ["ru", "uk", "en", "ro", "de", "zh"];

type Product = {
  id: string; title: string; description: string; price: number; oldPrice?: number | null;
  imageUrl?: string | null; sellerName: string; category: string; rating: number;
  reviewCount: number; stock: number; isTrending: boolean;
};

const CATEGORIES = [
  { labelKey: "cat.electronics", icon: "📱", slug: "Электроника" },
  { labelKey: "cat.gadgets", icon: "🎧", slug: "Гаджеты" },
  { labelKey: "cat.auto", icon: "🚗", slug: "Авто" },
  { labelKey: "cat.home", icon: "🏠", slug: "Дом" },
  { labelKey: "cat.clothes", icon: "👕", slug: "Одежда" },
  { labelKey: "cat.beauty", icon: "💄", slug: "Красота" },
  { labelKey: "cat.sport", icon: "⚽", slug: "Спорт" },
  { labelKey: "cat.gaming", icon: "🎮", slug: "Gaming" },
  { labelKey: "cat.tools", icon: "🔧", slug: "Инструменты" },
  { labelKey: "cat.kids", icon: "🧸", slug: "Дети" },
  { labelKey: "cat.office", icon: "💼", slug: "Офис" },
  { labelKey: "cat.accessories", icon: "⌚", slug: "Аксессуары" },
];

// Shown on Vercel when DB is empty (SQLite not persisted in serverless)
const DEMO_PRODUCTS: Product[] = [
  { id: "demo-1", title: "AirPods Pro", description: "Premium wireless earbuds with active noise cancellation and spatial audio. Excellent sound quality and comfort for all-day wear.", price: 299900, oldPrice: 399900, imageUrl: "https://picsum.photos/seed/airpods/400/300", sellerName: "TechZone UA", category: "Электроника", rating: 4.8, reviewCount: 324, stock: 45, isTrending: true },
  { id: "demo-2", title: "Smart Watch Pro", description: "Smartwatch with health monitoring, GPS, AMOLED display and 7-day battery life. Compatible with iOS and Android.", price: 249900, oldPrice: 319900, imageUrl: "https://picsum.photos/seed/smartwatch/400/300", sellerName: "GadgetStore", category: "Гаджеты", rating: 4.6, reviewCount: 218, stock: 30, isTrending: true },
  { id: "demo-3", title: "Power Bank 20000mAh", description: "High-capacity power bank with 65W fast charging, supports multiple devices simultaneously. Compact and lightweight design.", price: 89900, oldPrice: 119900, imageUrl: "https://picsum.photos/seed/powerbank/400/300", sellerName: "PowerTech", category: "Гаджеты", rating: 4.5, reviewCount: 156, stock: 80, isTrending: false },
  { id: "demo-4", title: "Wireless Headphones", description: "Over-ear headphones with 30-hour battery, premium sound, foldable design. Perfect for music, gaming and calls.", price: 159900, imageUrl: "https://picsum.photos/seed/headphones/400/300", sellerName: "AudioMax", category: "Электроника", rating: 4.4, reviewCount: 89, stock: 25, isTrending: true },
  { id: "demo-5", title: "Car Vacuum Cleaner", description: "Portable wireless car vacuum with strong suction, HEPA filter and flexible nozzle. Easy to use and clean.", price: 59900, oldPrice: 79900, imageUrl: "https://picsum.photos/seed/vacuum/400/300", sellerName: "AutoShop", category: "Авто", rating: 4.3, reviewCount: 67, stock: 60, isTrending: false },
  { id: "demo-6", title: "LED Desk Lamp", description: "Smart LED lamp with touch control, 5 brightness levels, USB charging port and eye-care technology.", price: 44900, imageUrl: "https://picsum.photos/seed/ledlamp/400/300", sellerName: "SmartHome UA", category: "Дом", rating: 4.7, reviewCount: 143, stock: 90, isTrending: false },
  { id: "demo-7", title: "USB-C Hub 7-in-1", description: "Multiport USB-C hub with HDMI 4K, 3x USB 3.0, SD card reader, PD charging. Works with MacBook and laptop.", price: 69900, oldPrice: 89900, imageUrl: "https://picsum.photos/seed/usbhub/400/300", sellerName: "TechZone UA", category: "Аксессуары", rating: 4.5, reviewCount: 201, stock: 55, isTrending: false },
  { id: "demo-8", title: "Mechanical Keyboard", description: "Compact 75% mechanical keyboard with RGB backlight, blue switches and aluminium case. Satisfying tactile feel.", price: 199900, imageUrl: "https://picsum.photos/seed/keyboard/400/300", sellerName: "GadgetStore", category: "Gaming", rating: 4.6, reviewCount: 112, stock: 20, isTrending: true },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string };
}) {
  const jar = cookies();
  const rawLang = jar.get("china_lang")?.value ?? DEFAULT_LANG;
  const lang: Lang = VALID_LANGS.includes(rawLang as Lang) ? (rawLang as Lang) : DEFAULT_LANG;
  const t = getT(lang);

  const SORT_OPTIONS = [
    { value: "newest", label: t("home.sort_newest") },
    { value: "cheap", label: t("home.sort_cheap") },
    { value: "expensive", label: t("home.sort_expensive") },
    { value: "rating", label: t("home.sort_rating") },
    { value: "popular", label: t("home.sort_popular") },
  ];

  const search = searchParams.search || "";
  const category = searchParams.category || "";
  const sort = searchParams.sort || "newest";
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) * 100 : undefined;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) * 100 : undefined;

  const where = {
    AND: [
      search ? {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
          { sellerName: { contains: search } },
          { category: { contains: search } },
        ],
      } : {},
      category ? { category } : {},
      minPrice ? { price: { gte: minPrice } } : {},
      maxPrice ? { price: { lte: maxPrice } } : {},
    ],
  };

  const orderBy =
    sort === "cheap" ? { price: "asc" as const } :
    sort === "expensive" ? { price: "desc" as const } :
    sort === "rating" ? { rating: "desc" as const } :
    sort === "popular" ? { views: "desc" as const } :
    { createdAt: "desc" as const };

  let products: Product[] = [];
  let trending: Product[] = [];
  let recommended: Product[] = [];
  let totalProducts = 0;
  let totalSellers = 0;
  let totalOrders = 0;

  try {
    const [p, tr, r, stats] = await Promise.all([
      prisma.sellerProduct.findMany({ where, orderBy, take: 40 }),
      prisma.sellerProduct.findMany({ where: { isTrending: true }, take: 8, orderBy: { views: "desc" } }),
      prisma.sellerProduct.findMany({ where: { isRecommended: true }, take: 8, orderBy: { rating: "desc" } }),
      Promise.all([
        prisma.sellerProduct.count(),
        prisma.seller.count(),
        prisma.order.count(),
      ]),
    ]);
    products = p;
    trending = tr;
    recommended = r;
    [totalProducts, totalSellers, totalOrders] = stats;
  } catch (e) {
    console.error("DB error on homepage:", e);
  }

  const isFiltered = !!(search || category || minPrice || maxPrice);

  // Fallback: show demo products when DB is empty (Vercel SQLite not persisted)
  if (!isFiltered && products.length === 0) {
    products = DEMO_PRODUCTS;
    trending = DEMO_PRODUCTS.filter((p) => p.isTrending);
    totalProducts = DEMO_PRODUCTS.length;
  }

  return (
    <>
      {/* Hero */}
      {!isFiltered && (
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">{t("home.hero_badge")}</div>
              <h1>{t("home.hero_title")}</h1>
              <p>{t("home.hero_desc")}</p>
              <div className="hero-search">
                <SearchBar placeholder={t("nav.search_placeholder")} />
              </div>
              <div className="hero-btns">
                <Link href="#catalog" className="hero-btn-primary">{t("home.browse_catalog")}</Link>
                <Link href="/seller/register" className="hero-btn-outline">{t("home.become_seller")}</Link>
              </div>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>{totalProducts}</strong><span>{t("home.total_products")}</span></div>
              <div className="hero-stat"><strong>{totalSellers}</strong><span>{t("home.total_sellers")}</span></div>
              <div className="hero-stat"><strong>{totalOrders}</strong><span>{t("home.total_orders")}</span></div>
              <div className="hero-stat"><strong>24/7</strong><span>AI</span></div>
            </div>
          </div>
        </section>
      )}

      <div className="page-wrap">
        {/* Benefits */}
        {!isFiltered && (
          <div className="benefits">
            <div>🚚 {t("home.benefit3_desc")}</div>
            <div>✅ {t("home.benefit2_title")}</div>
            <div>🤖 {t("home.benefit1_title")}</div>
            <div>🎟 CHINA10 = -10%</div>
          </div>
        )}

        {/* Categories */}
        {!isFiltered && (
          <section className="categories-section">
            <h2 className="section-title">{t("home.categories")}</h2>
            <div className="categories-grid">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/?category=${encodeURIComponent(c.slug)}`} className="cat-card">
                  <span className="cat-icon">{c.icon}</span>
                  <span>{t(c.labelKey)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        {!isFiltered && trending.length > 0 && (
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">{t("home.trending")}</h2>
              <Link href="/?sort=popular" className="see-all">→</Link>
            </div>
            <div className="products-grid">
              {trending.map((p) => <ProductCard key={p.id} product={p} t={t} />)}
            </div>
          </section>
        )}

        {/* Recommended */}
        {!isFiltered && recommended.length > 0 && (
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">{t("home.recommended")}</h2>
              <Link href="/?sort=rating" className="see-all">→</Link>
            </div>
            <div className="products-grid">
              {recommended.map((p) => <ProductCard key={p.id} product={p} t={t} />)}
            </div>
          </section>
        )}

        {/* AI Assistant */}
        {!isFiltered && (
          <section className="ai-section">
            <div className="section-header">
              <h2 className="section-title">🤖 {t("ai.title")}</h2>
            </div>
            <AIAssistant />
          </section>
        )}

        {/* Main catalog */}
        <section id="catalog" className="products-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {isFiltered
                  ? search ? `«${search}»` : category
                  : t("home.catalog")}
              </h2>
              <span className="section-sub">{products.length} {t("home.products_found")}</span>
            </div>
            <Link href="/seller/products" className="btn-secondary">+ {t("seller.add_product")}</Link>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <form method="GET" action="/" className="filters-form">
              {search && <input type="hidden" name="search" value={search} />}
              {category && <input type="hidden" name="category" value={category} />}
              <select name="sort" defaultValue={sort}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <input type="number" name="minPrice" placeholder={t("home.filter_from")} defaultValue={searchParams.minPrice} className="price-input" />
              <input type="number" name="maxPrice" placeholder={t("home.filter_to")} defaultValue={searchParams.maxPrice} className="price-input" />
              <button type="submit" className="btn-filter">{t("home.apply")}</button>
              {isFiltered && <Link href="/" className="btn-clear">✕ {t("home.reset")}</Link>}
            </form>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div>🔍</div>
              <h3>{t("home.no_products")}</h3>
              {isFiltered && <Link href="/" className="btn-primary">{t("nav.home")}</Link>}
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} t={t} />)}
            </div>
          )}
        </section>

        {/* Seller CTA */}
        {!isFiltered && (
          <section className="cta-section">
            <div className="cta-inner">
              <div>
                <h2>{t("home.become_seller")}</h2>
                <p>{totalSellers}+ {t("home.total_sellers")}</p>
              </div>
              <Link href="/seller/register" className="btn-primary">→</Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function ProductCard({ product: p, t }: { product: Product; t: (key: string) => string }) {
  const discount = p.oldPrice && p.oldPrice > p.price
    ? Math.round((1 - p.price / p.oldPrice) * 100)
    : null;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <Link href={`/product/${p.id}`}>
          <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/400/300`} alt={p.title} className="product-img" />
        </Link>
        {discount && <span className="discount-badge">-{discount}%</span>}
        {p.isTrending && <span className="trending-badge">🔥</span>}
        <WishlistButton product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl, sellerName: p.sellerName }} />
      </div>
      <div className="product-body">
        <span className="product-category">{p.category}</span>
        <Link href={`/product/${p.id}`} className="product-title">{p.title}</Link>
        <p className="product-desc">{p.description.slice(0, 70)}{p.description.length > 70 ? "…" : ""}</p>
        <div className="product-rating">
          <Stars rating={p.rating} />
          <span>({p.reviewCount})</span>
        </div>
        <div className="product-price-row">
          <Price amount={p.price} className="product-price" />
          {p.oldPrice && p.oldPrice > p.price && (
            <Price amount={p.oldPrice} className="product-old-price" />
          )}
        </div>
        <span className="product-seller">🏪 {p.sellerName}</span>
        <div className="product-actions">
          <AddToCartButton product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl, sellerName: p.sellerName }} />
          <Link href={`/product/${p.id}`} className="btn-view">{t("home.view")}</Link>
        </div>
      </div>
    </div>
  );
}
