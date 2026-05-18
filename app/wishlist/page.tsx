"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WishItem = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string | null;
  sellerName?: string;
};

function fmt(kopecks: number) {
  return (kopecks / 100).toFixed(2) + " грн";
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlist(Array.isArray(raw) ? raw : []);
    } catch {
      setWishlist([]);
    }
  }, []);

  function remove(id: string) {
    const updated = wishlist.filter((i) => i.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  }

  function addToCart(item: WishItem) {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((c: WishItem) => c.id === item.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch {}
  }

  if (!mounted) return null;

  return (
    <div className="page-wrap">
      <h1 className="page-title">🤍 Избранное</h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div>🤍</div>
          <h3>Список избранного пуст</h3>
          <p>Добавляйте товары в избранное — нажмите 🤍 на карточке товара</p>
          <Link href="/" className="btn-primary">Перейти в каталог</Link>
        </div>
      ) : (
        <>
          <p style={{ color: "#64748b", marginBottom: "8px" }}>
            {wishlist.length} {wishlist.length === 1 ? "товар" : wishlist.length < 5 ? "товара" : "товаров"} в избранном
          </p>
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <Link href={`/product/${item.id}`}>
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/300`}
                    alt={item.title}
                  />
                </Link>
                <div className="wishlist-card-body">
                  <Link href={`/product/${item.id}`} className="wishlist-card-title">
                    {item.title}
                  </Link>
                  {item.sellerName && (
                    <div style={{ fontSize: "12px", color: "#64748b", margin: "4px 0" }}>
                      🏪 {item.sellerName}
                    </div>
                  )}
                  <div className="wishlist-card-price">{fmt(item.price)}</div>
                  <div className="wishlist-card-actions">
                    <button
                      onClick={() => addToCart(item)}
                      className="btn-primary"
                      style={{ fontSize: "13px", padding: "8px 14px" }}
                    >
                      В корзину
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="btn-view"
                      style={{ fontSize: "13px", padding: "8px 14px" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
