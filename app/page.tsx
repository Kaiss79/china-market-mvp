export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import SearchBar from "./SearchBar";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./components/WishlistButton";
import AIAssistant from "./components/AIAssistant";

const CATEGORIES = [
  { label: "Электроника", icon: "📱", slug: "Электроника" },
  { label: "Гаджеты", icon: "🎧", slug: "Гаджеты" },
  { label: "Авто", icon: "🚗", slug: "Авто" },
  { label: "Дом", icon: "🏠", slug: "Дом" },
  { label: "Одежда", icon: "👕", slug: "Одежда" },
  { label: "Красота", icon: "💄", slug: "Красота" },
  { label: "Спорт", icon: "⚽", slug: "Спорт" },
  { label: "Gaming", icon: "🎮", slug: "Gaming" },
  { label: "Инструменты", icon: "🔧", slug: "Инструменты" },
  { label: "Дети", icon: "🧸", slug: "Дети" },
  { label: "Офис", icon: "💼", slug: "Офис" },
  { label: "Аксессуары", icon: "⌚", slug: "Аксессуары" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Новинки" },
  { value: "cheap", label: "Дешевле" },
  { value: "expensive", label: "Дороже" },
  { value: "rating", label: "По рейтингу" },
  { value: "popular", label: "Популярные" },
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
    const [p, t, r, stats] = await Promise.all([
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
    trending = t;
    recommended = r;
    [totalProducts, totalSellers, totalOrders] = stats;
  } catch (e) {
    console.error("DB error on homepage:", e);
  }

  const isFiltered = !!(search || category || minPrice || maxPrice);

  return (
    <>
      {/* Hero */}
      {!isFiltered && (
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge">🔥 AI Marketplace Platform</div>
              <h1>Лучшие товары из Китая — здесь</h1>
              <p>Умный маркетплейс с AI-поиском, проверенными продавцами и ценами ниже рынка.</p>
              <div className="hero-search">
                <SearchBar placeholder="🔍 AirPods, наушники, авто, гаджеты..." />
              </div>
              <div className="hero-btns">
                <Link href="#catalog" className="hero-btn-primary">Смотреть каталог</Link>
                <Link href="/seller/register" className="hero-btn-outline">Стать продавцом</Link>
              </div>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>{totalProducts}</strong><span>Товаров</span></div>
              <div className="hero-stat"><strong>{totalSellers}</strong><span>Продавцов</span></div>
              <div className="hero-stat"><strong>{totalOrders}</strong><span>Заказов</span></div>
              <div className="hero-stat"><strong>24/7</strong><span>AI поддержка</span></div>
            </div>
          </div>
        </section>
      )}

      <div className="page-wrap">
        {/* Benefits */}
        {!isFiltered && (
          <div className="benefits">
            <div>🚚 Доставка по Украине</div>
            <div>✅ Проверенные продавцы</div>
            <div>🤖 AI-поиск товаров</div>
            <div>🎟 Промокод CHINA10 = -10%</div>
          </div>
        )}

        {/* Categories */}
        {!isFiltered && (
          <section className="categories-section">
            <h2 className="section-title">Категории</h2>
            <div className="categories-grid">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/?category=${encodeURIComponent(c.slug)}`} className="cat-card">
                  <span className="cat-icon">{c.icon}</span>
                  <span>{c.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        {!isFiltered && trending.length > 0 && (
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">🔥 Trending сейчас</h2>
              <Link href="/?sort=popular" className="see-all">Смотреть все →</Link>
            </div>
            <div className="products-grid">
              {trending.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Recommended */}
        {!isFiltered && recommended.length > 0 && (
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">⭐ Рекомендуем</h2>
              <Link href="/?sort=rating" className="see-all">Смотреть все →</Link>
            </div>
            <div className="products-grid">
              {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* AI Assistant */}
        {!isFiltered && (
          <section className="ai-section">
            <div className="section-header">
              <h2 className="section-title">🤖 AI-ассистент</h2>
              <span className="section-sub">Опишите что ищете — AI подберёт товары</span>
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
                  ? search ? `Результаты: «${search}»` : `Категория: ${category}`
                  : "🛍️ Все товары"}
              </h2>
              <span className="section-sub">{products.length} товаров найдено</span>
            </div>
            <Link href="/seller/products" className="btn-secondary">+ Добавить товар</Link>
          </div>

          {/* Filters bar */}
          <div className="filters-bar">
            <form method="GET" action="/" className="filters-form">
              {search && <input type="hidden" name="search" value={search} />}
              {category && <input type="hidden" name="category" value={category} />}
              <select name="sort" defaultValue={sort}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <input type="number" name="minPrice" placeholder="Цена от" defaultValue={searchParams.minPrice} className="price-input" />
              <input type="number" name="maxPrice" placeholder="Цена до" defaultValue={searchParams.maxPrice} className="price-input" />
              <button type="submit" className="btn-filter">Применить</button>
              {isFiltered && <Link href="/" className="btn-clear">✕ Сбросить</Link>}
            </form>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div>🔍</div>
              <h3>Ничего не найдено</h3>
              <p>{isFiltered ? "Попробуйте другой запрос" : "Товары скоро появятся"}</p>
              {isFiltered && <Link href="/" className="btn-primary">На главную</Link>}
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        {/* Seller CTA */}
        {!isFiltered && (
          <section className="cta-section">
            <div className="cta-inner">
              <div>
                <h2>Начните продавать на China Market</h2>
                <p>Более {totalSellers} продавцов уже зарабатывают на платформе</p>
              </div>
              <Link href="/seller/register" className="btn-primary">Зарегистрироваться →</Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

type Product = {
  id: string; title: string; description: string; price: number; oldPrice?: number | null;
  imageUrl?: string | null; sellerName: string; category: string; rating: number;
  reviewCount: number; stock: number; isTrending: boolean;
};

function ProductCard({ product: p }: { product: Product }) {
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
          <span className="product-price">{formatMoney(p.price)}</span>
          {p.oldPrice && p.oldPrice > p.price && (
            <span className="product-old-price">{formatMoney(p.oldPrice)}</span>
          )}
        </div>
        <span className="product-seller">🏪 {p.sellerName}</span>
        <div className="product-actions">
          <AddToCartButton product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl, sellerName: p.sellerName }} />
          <Link href={`/product/${p.id}`} className="btn-view">Детали</Link>
        </div>
      </div>
    </div>
  );
}
