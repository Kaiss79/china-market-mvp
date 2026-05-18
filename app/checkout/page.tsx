"use client";

import { useEffect, useState } from "react";
import { createOrder } from "./actions";

type CartItem = {
  id: string; title: string; price: number;
  imageUrl?: string | null; quantity: number; sellerName?: string;
};

function safePrice(v: unknown) {
  const n = Number(v);
  return isNaN(n) || n < 0 ? 0 : n;
}

const PROMOS: Record<string, number> = { CHINA10: 10 };

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = JSON.parse(localStorage.getItem("cart") || "[]");
      const safe = raw
        .filter((i: unknown) => i && typeof i === "object")
        .map((i: Partial<CartItem>) => ({
          id: String(i.id || ""), title: String(i.title || "Товар"),
          price: safePrice(i.price), imageUrl: i.imageUrl || null,
          quantity: Math.max(1, Number(i.quantity) || 1), sellerName: String(i.sellerName || ""),
        }))
        .filter((i: CartItem) => i.id && i.price > 0);
      setCart(safe);
    } catch { setCart([]); }
  }, []);

  const subtotal = cart.reduce((s, i) => s + safePrice(i.price) * i.quantity, 0);
  const discountAmt = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmt;

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setDiscount(PROMOS[code]);
      setPromoMsg(`✅ Промокод применён — скидка ${PROMOS[code]}%`);
    } else {
      setDiscount(0);
      setPromoMsg("❌ Промокод не найден");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);
    data.set("total", String(total));
    data.set("items", JSON.stringify(cart));
    data.set("promoCode", promo.trim().toUpperCase());
    localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    await createOrder(data);
  }

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="page-wrap">
        <div className="empty-state">
          <div>🛒</div><h3>Корзина пустая</h3>
          <a href="/" className="btn-primary">В каталог</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <h1 className="page-title">Оформление заказа</h1>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-block">
            <h3>Контактная информация</h3>
            <div className="form-row">
              <div className="form-field"><label>Имя *</label><input name="name" placeholder="Иван Петров" required /></div>
              <div className="form-field"><label>Телефон *</label><input name="phone" placeholder="+380 67 123 45 67" required /></div>
            </div>
            <div className="form-field"><label>Email</label><input name="email" type="email" placeholder="ivan@gmail.com" /></div>
          </div>

          <div className="form-block">
            <h3>Доставка</h3>
            <div className="form-field"><label>Адрес / Отделение Новой Почты *</label>
              <input name="address" placeholder="Киев, Нова Пошта №14" required /></div>
            <div className="form-field"><label>Комментарий</label>
              <textarea name="comment" placeholder="Уточнения к заказу..." rows={2} /></div>
          </div>

          <div className="form-block">
            <h3>Промокод</h3>
            <div className="promo-row">
              <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Например: CHINA10" className="promo-input" />
              <button type="button" onClick={applyPromo} className="btn-secondary">Применить</button>
            </div>
            {promoMsg && <div className="promo-msg">{promoMsg}</div>}
          </div>

          <div className="form-block">
            <h3>Оплата</h3>
            <label className="radio-option"><input type="radio" name="payment" defaultChecked /> 💵 Наложенный платёж</label>
            <label className="radio-option"><input type="radio" name="payment" /> 💳 Онлайн картой</label>
          </div>

          <button type="submit" className="btn-checkout-submit" disabled={loading}>
            {loading ? "Оформляем..." : `Подтвердить заказ — ${(total / 100).toFixed(2)} грн`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Ваш заказ</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-row">
              <img src={item.imageUrl || `https://picsum.photos/seed/${item.id}/50/50`} alt={item.title} />
              <div className="summary-info">
                <span>{item.title}</span>
                <span className="summary-qty">× {item.quantity}</span>
              </div>
              <span className="summary-price">{((safePrice(item.price) * item.quantity) / 100).toFixed(2)} грн</span>
            </div>
          ))}
          <div className="summary-line"><span>Товары</span><span>{(subtotal / 100).toFixed(2)} грн</span></div>
          {discount > 0 && <div className="summary-line discount"><span>Скидка {discount}%</span><span>−{(discountAmt / 100).toFixed(2)} грн</span></div>}
          <div className="summary-line total"><span>Итого</span><strong>{(total / 100).toFixed(2)} грн</strong></div>
          <div className="checkout-trust">
            <span>🔒 Безопасная оплата</span>
            <span>🚚 Доставка 2–5 дней</span>
            <span>↩️ Возврат 14 дней</span>
          </div>
        </div>
      </div>
    </div>
  );
}
