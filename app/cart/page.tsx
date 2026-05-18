"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

function fmt(kopecks: number) {
  return (safePrice(kopecks) / 100).toFixed(2) + " грн";
}

export default function CartPage() {
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
      <h1 className="page-title">🛒 Корзина</h1>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div>🛒</div>
          <h3>Корзина пустая</h3>
          <p>Добавьте товары из каталога</p>
          <Link href="/" className="btn-primary">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Товар</span>
              <span>Цена</span>
              <span>Кол-во</span>
              <span>Сумма</span>
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
                <div className="cart-price">{fmt(item.price)}</div>
                <div className="cart-qty-ctrl">
                  <button onClick={() => changeQty(item.id, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQty(item.id, 1)}>+</button>
                </div>
                <div className="cart-subtotal">{fmt(item.price * item.quantity)}</div>
                <button onClick={() => remove(item.id)} className="cart-remove">✕</button>
              </div>
            ))}

            <div className="cart-footer">
              <button onClick={clearCart} className="btn-clear-cart">Очистить корзину</button>
              <Link href="/" className="btn-continue">← Продолжить покупки</Link>
            </div>
          </div>

          <div className="cart-summary-box">
            <h3>Сумма заказа</h3>
            <div className="cart-summary-row"><span>Товаров</span><span>{cart.reduce((s, i) => s + i.quantity, 0)} шт.</span></div>
            <div className="cart-summary-row"><span>Доставка</span><span className="free">Бесплатно</span></div>
            <div className="cart-summary-row total"><span>Итого</span><strong>{fmt(total)}</strong></div>
            <div className="promo-hint">🎟 Промокод <strong>CHINA10</strong> = скидка 10%</div>
            <Link href="/checkout" className="btn-checkout">Оформить заказ</Link>
            <div className="cart-badges">
              <span>🔒 Безопасная оплата</span>
              <span>🚚 Доставка по Украине</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
