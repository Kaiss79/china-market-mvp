export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DEFAULT_LANG, getT, type Lang } from "@/lib/i18n";
import AddToCartButton from "@/app/AddToCartButton";
import WishlistButton from "@/app/components/WishlistButton";
import ReviewForm from "@/app/components/ReviewForm";
import Price from "@/app/components/Price";

const VALID_LANGS: Lang[] = ["ru", "uk", "en", "ro", "de", "zh"];

export default async function ProductPage({ params }: { params: { id: string } }) {
  const jar = cookies();
  const rawLang = jar.get("china_lang")?.value ?? DEFAULT_LANG;
  const lang: Lang = VALID_LANGS.includes(rawLang as Lang) ? (rawLang as Lang) : DEFAULT_LANG;
  const t = getT(lang);

  let product: Awaited<ReturnType<typeof prisma.sellerProduct.findUnique>> & {
    reviews: { id: string; customer: string; rating: number; text: string; createdAt: Date }[]
  } | null = null;
  let similar: Awaited<ReturnType<typeof prisma.sellerProduct.findMany>> = [];

  try {
    product = await prisma.sellerProduct.findUnique({
      where: { id: params.id },
      include: { reviews: { orderBy: { createdAt: "desc" } } },
    });

    if (product) {
      await prisma.sellerProduct.update({
        where: { id: params.id },
        data: { views: { increment: 1 } },
      }).catch(() => {});

      similar = await prisma.sellerProduct.findMany({
        where: { category: product.category, id: { not: product.id } },
        take: 4,
        orderBy: { rating: "desc" },
      });
    }
  } catch (e) {
    console.error("DB error on product page:", e);
  }

  if (!product) notFound();

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <div className="page-wrap">
      <div className="breadcrumb">
        <Link href="/">{t("nav.home")}</Link>
        <span>›</span>
        <Link href={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span>›</span>
        <span>{product.title}</span>
      </div>

      <div className="product-detail-layout">
        <div className="product-detail-images">
          <div style={{ position: "relative" }}>
            <img
              src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/500`}
              alt={product.title}
              className="product-detail-img"
            />
            {discount && <span className="detail-discount-badge">-{discount}%</span>}
          </div>
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="product-detail-title">{product.title}</h1>

          <div className="product-detail-rating">
            <span className="stars">
              {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
            </span>
            <span className="review-count">({product.reviewCount} {t("product.reviews_count")})</span>
            <span className="product-detail-views">👁 {product.views} {t("product.views")}</span>
          </div>

          <div className="product-detail-price-block">
            <Price amount={product.price} className="product-detail-price" />
            {product.oldPrice && product.oldPrice > product.price && (
              <Price amount={product.oldPrice} className="product-detail-old-price" />
            )}
          </div>

          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-seller">
            <span>🏪 {t("product.seller")}:</span>
            <strong>{product.sellerName}</strong>
          </div>

          <div className="product-detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✅ {t("product.in_stock")} ({product.stock} {t("product.pcs")})</span>
            ) : (
              <span className="out-of-stock">❌ {t("product.out_of_stock")}</span>
            )}
          </div>

          <div className="product-detail-actions">
            <AddToCartButton product={{
              id: product.id, title: product.title,
              price: product.price, imageUrl: product.imageUrl, sellerName: product.sellerName,
            }} />
            <WishlistButton product={{
              id: product.id, title: product.title,
              price: product.price, imageUrl: product.imageUrl, sellerName: product.sellerName,
            }} />
          </div>

          <div className="product-detail-trust">
            <div>🔒 {t("product.safe_pay")}</div>
            <div>🚚 {t("product.delivery")}</div>
            <div>↩️ {t("product.returns")}</div>
            <div>📞 {t("product.support_247")}</div>
          </div>

          <div className="ai-analysis-box">
            <h3>{t("product.ai_analysis")}</h3>
            <p>
              {t("product.category")} <strong>{product.category}</strong>, {t("product.seller").toLowerCase()}{" "}
              <strong>{product.sellerName}</strong>, {product.rating.toFixed(1)}/5 ({product.reviewCount} {t("product.reviews_count")}).
              {discount ? ` ${t("product.discount")} ${discount}%.` : ""}
              {product.isTrending ? ` ${t("product.trending")}` : ""}
            </p>
            <p>
              <strong>{t("product.ai_conclusion")}</strong>{" "}
              {product.rating >= 4 ? t("product.recommend_high") :
               product.rating >= 3 ? t("product.recommend_mid") :
               t("product.recommend_low")}
            </p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="products-section" style={{ marginTop: "2rem" }}>
          <h2 className="section-title">{t("product.similar")}</h2>
          <div className="products-grid">
            {similar.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-img-wrap">
                  <Link href={`/product/${p.id}`}>
                    <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/400/300`} alt={p.title} className="product-img" />
                  </Link>
                </div>
                <div className="product-body">
                  <span className="product-category">{p.category}</span>
                  <Link href={`/product/${p.id}`} className="product-title">{p.title}</Link>
                  <div className="product-price-row">
                    <Price amount={p.price} className="product-price" />
                  </div>
                  <div className="product-actions">
                    <AddToCartButton product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl, sellerName: p.sellerName }} />
                    <Link href={`/product/${p.id}`} className="btn-view">{t("product.view_details")}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="reviews-section">
        <h2 className="section-title">{t("product.reviews")} ({product.reviews.length})</h2>
        {product.reviews.length === 0 ? (
          <p className="no-reviews">{t("product.no_reviews")}</p>
        ) : (
          <div className="reviews-list">
            {product.reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <strong>{r.customer}</strong>
                  <span className="stars">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </span>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString("ru-UA")}</span>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>
        )}
        <div className="review-form-wrap">
          <h3>{t("product.leave_review")}</h3>
          <ReviewForm productId={product.id} />
        </div>
      </section>
    </div>
  );
}
