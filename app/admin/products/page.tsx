export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export default async function AdminProductsPage() {
  const products = await prisma.sellerProduct.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const trending = products.filter((p) => p.isTrending).length;

  return (
    <div className="page-wrap">
      <div className="dash-header">
        <div>
          <h1 className="page-title">🛍️ Все товары</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Полный каталог маркетплейса</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/seller/products" className="btn-primary">+ Добавить товар</Link>
          <Link href="/admin" className="btn-secondary">← Admin</Link>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">🛍️</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Товаров</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{totalStock}</div>
          <div className="stat-label">В наличии</div>
        </div>
        <div className="stat-box stat-ai">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{trending}</div>
          <div className="stat-label">Трендовых</div>
        </div>
      </div>

      <div className="admin-list">
        {products.length === 0 ? (
          <div className="empty-state">
            <div>🛍️</div>
            <h3>Товаров пока нет</h3>
            <p>Добавьте первый товар через панель продавца</p>
            <Link href="/seller/products" className="btn-primary">Добавить товар</Link>
          </div>
        ) : (
          <div className="products-list">
            {products.map((product) => (
              <div key={product.id} className="product-row" style={{ display: "flex", alignItems: "center", gap: "16px", background: "white", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "8px" }}>
                <img
                  src={product.imageUrl || `https://picsum.photos/seed/${product.id}/60/60`}
                  alt={product.title}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/product/${product.id}`} style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>
                    {product.title}
                  </Link>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    🏪 {product.sellerName} · {product.category} · ⭐ {product.rating.toFixed(1)} ({product.reviewCount})
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: "16px" }}>{formatMoney(product.price)}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Остаток: {product.stock}</div>
                  {product.isTrending && <span style={{ fontSize: "11px", background: "#fff7ed", color: "#c2410c", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>🔥 Тренд</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
