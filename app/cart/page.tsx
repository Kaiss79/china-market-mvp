"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/app/components/SettingsProvider";

type CartItem = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  sellerName?: string;
};

function safePrice(v: unknown): number {
  const n = Number(v);
  return isNaN(n) || n < 0 ? 0 : n;
}

export default function CartPage() {
  const { t, formatPrice } = useSettings();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = JSON.parse(localStorage.getItem("cart") || "[]");
      const safe = raw
        .filter((i: unknown) => i && typeof i === "object")
        .map((i: Partial<CartItem>) => ({
          id: String(i.id || ""),
          title: String(i.title || "Товар"),
          price: safePrice(i.price),
          imageUrl: i.imageUrl || null,
          quantity: Math.max(1, Number(i.quantity) || 1),
          sellerName: String(i.sellerName || ""),
        }))
        .filter((i: CartItem) => i.id && i.price > 0);
      setCart(safe);
    } catch { setCart([]); }
  }, []);

  function save(updated: CartItem[]) {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  function changeQty(id: string, delta: number) {
    save(cart.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  }

  function remove(id: string) {
    save(cart.filter((i) => i.id !== id));
  }

  function clearCart() {
    save([]);
  }

  const total = cart.reduce((s, i) => s + safePrice(i.price) * i.quantity, 0);

  if (!mounted) return null;

  return (
    <div className="page-wrap">
      <h1 className="page-title">{t("cart.title")}</h1>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div>🛒</div>
          <h3>{t("cart.empty")}</h3>
          <p>{t("cart.empty_desc")}</p>
          <Link href="/" className="btn-primary">{t("cart.go_catalog")}</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>{t("cart.product")}</span>
              <span>{t("cart.price")}</span>
              <span>{t("cart.qty")}</span>
              <span>{t("cart.sum")}</span>
              <span></span>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="cart-row">
                <div className="cart-product">
                  <img src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`} alt={item.title} />
                  <div>
                    <Link href={`/product/${item.id}`} className="cart-title">{item.title}</Link>
                    {item.sellerName && <span className="cart-seller">🏪 {item.sellerName}</span>}
                  </div>
                </div>
                <div className="cart-price" suppressHydrationWarning>{formatPrice(item.price)}</div>
                <div className="cart-qty-ctrl">
                  <button onClick={() => changeQty(item.id, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQty(item.id, 1)}>+</button>
                </div>
                <div className="cart-subtotal" suppressHydrationWarning>{formatPrice(item.price * item.quantity)}</div>
                <button onClick={() => remove(item.id)} className="cart-remove">✕</button>
              </div>
            ))}

            <div className="cart-footer">
              <button onClick={clearCart} className="btn-clear-cart">{t("cart.clear")}</button>
              <Link href="/" className="btn-continue">{t("cart.continue")}</Link>
            </div>
          </div>

          <div className="cart-summary-box">
            <h3>{t("cart.order_total")}</h3>
            <div className="cart-summary-row">
              <span>{t("cart.items")}</span>
              <span>{cart.reduce((s, i) => s + i.quantity, 0)} {t("cart.pcs")}</span>
            </div>
            <div className="cart-summary-row">
              <span>{t("cart.delivery")}</span>
              <span className="free">{t("cart.free")}</span>
            </div>
            <div className="cart-summary-row total">
              <span>{t("cart.total")}</span>
              <strong suppressHydrationWarning>{formatPrice(total)}</strong>
            </div>
            <div className="promo-hint">{t("cart.promo_hint")}</div>
            <Link href="/checkout" className="btn-checkout">{t("cart.checkout")}</Link>
            <div className="cart-badges">
              <span>{t("cart.safe_pay")}</span>
              <span>{t("cart.delivery_ua")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
