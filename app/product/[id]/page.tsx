import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import AddToCartButton from "@/app/AddToCartButton";
import WishlistButton from "@/app/components/WishlistButton";
import ReviewForm from "@/app/components/ReviewForm";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.sellerProduct.findUnique({
    where: { id: params.id },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });

  if (!product) notFound();

  await prisma.sellerProduct.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });

  const similar = await prisma.sellerProduct.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 4,
    orderBy: { rating: "desc" },
  });

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  return (
    <div className="page-wrap">
      <div className="breadcrumb">
        <Link href="/">Главная</Link>
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
            <span className="review-count">({product.reviewCount} отзывов)</span>
            <span className="product-detail-views">👁 {product.views} просмотров</span>
          </div>

          <div className="product-detail-price-block">
            <span className="product-detail-price">{formatMoney(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="product-detail-old-price">{formatMoney(product.oldPrice)}</span>
            )}
          </div>

          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-seller">
            <span>🏪 Продавец:</span>
            <strong>{product.sellerName}</strong>
          </div>

          <div className="product-detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✅ В наличии ({product.stock} шт.)</span>
            ) : (
              <span className="out-of-stock">❌ Нет в наличии</span>
            )}
          </div>

          <div className="product-detail-actions">
            <AddToCartButton product={{
              id: product.id,
              title: product.title,
              price: product.price,
              imageUrl: product.imageUrl,
              sellerName: product.sellerName,
            }} />
            <WishlistButton product={{
              id: product.id,
              title: product.title,
              price: product.price,
              imageUrl: product.imageUrl,
              sellerName: product.sellerName,
            }} />
          </div>

          <div className="product-detail-trust">
            <div>🔒 Безопасная оплата</div>
            <div>🚚 Доставка 2–5 дней</div>
            <div>↩️ Возврат 14 дней</div>
            <div>📞 Поддержка 24/7</div>
          </div>

          <div className="ai-analysis-box">
            <h3>🤖 AI-анализ товара</h3>
            <p>
              Категория <strong>{product.category}</strong>, продавец{" "}
              <strong>{product.sellerName}</strong>, рейтинг{" "}
              <strong>{product.rating.toFixed(1)}/5</strong> ({product.reviewCount} отзывов).
              {discount ? ` Скидка ${discount}% от первоначальной цены.` : ""}
              {product.isTrending ? " Товар в тренде — высокий спрос прямо сейчас." : ""}
            </p>
            <p>
              <strong>Вывод:</strong>{" "}
              {product.rating >= 4 ? "Рекомендуем к покупке — высокий рейтинг." :
               product.rating >= 3 ? "Средние оценки — прочитайте отзывы." :
               "Мало отзывов — первым оцените товар."}
            </p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="products-section" style={{ marginTop: "2rem" }}>
          <h2 className="section-title">Похожие товары</h2>
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
                    <span className="product-price">{formatMoney(p.price)}</span>
                  </div>
                  <div className="product-actions">
                    <AddToCartButton product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl, sellerName: p.sellerName }} />
                    <Link href={`/product/${p.id}`} className="btn-view">Детали</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="reviews-section">
        <h2 className="section-title">Отзывы ({product.reviews.length})</h2>
        {product.reviews.length === 0 ? (
          <p className="no-reviews">Пока нет отзывов. Будьте первым!</p>
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
          <h3>Оставить отзыв</h3>
          <ReviewForm productId={product.id} />
        </div>
      </section>
    </div>
  );
}
