"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/app/components/SettingsProvider";
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
  const { t, formatPrice } = useSettings();
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
      setPromoMsg(`✅ ${t("checkout.promo_section")} ${PROMOS[code]}%`);
    } else {
      setDiscount(0);
      setPromoMsg("❌");
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
          <div>🛒</div><h3>{t("checkout.empty")}</h3>
          <a href="/" className="btn-primary">{t("checkout.go_catalog")}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <h1 className="page-title">{t("checkout.title")}</h1>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-block">
            <h3>{t("checkout.contacts")}</h3>
            <div className="form-row">
              <div className="form-field">
                <label>{t("checkout.name")}</label>
                <input name="name" placeholder={t("checkout.name_ph")} required />
              </div>
              <div className="form-field">
                <label>{t("checkout.phone")}</label>
                <input name="phone" placeholder={t("checkout.phone_ph")} required />
              </div>
            </div>
            <div className="form-field">
              <label>{t("checkout.email")}</label>
              <input name="email" type="email" placeholder={t("checkout.email_ph")} />
            </div>
          </div>

          <div className="form-block">
            <h3>{t("checkout.delivery_section")}</h3>
            <div className="form-field">
              <label>{t("checkout.address")}</label>
              <input name="address" placeholder={t("checkout.address_ph")} required />
            </div>
            <div className="form-field">
              <label>{t("checkout.comment")}</label>
              <textarea name="comment" placeholder={t("checkout.comment_ph")} rows={2} />
            </div>
          </div>

          <div className="form-block">
            <h3>{t("checkout.promo_section")}</h3>
            <div className="promo-row">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder={t("checkout.promo_ph")}
                className="promo-input"
              />
              <button type="button" onClick={applyPromo} className="btn-secondary">
                {t("checkout.promo_apply")}
              </button>
            </div>
            {promoMsg && <div className="promo-msg">{promoMsg}</div>}
          </div>

          <div className="form-block">
            <h3>{t("checkout.payment_section")}</h3>
            <label className="radio-option"><input type="radio" name="payment" defaultChecked /> {t("checkout.pay_cod")}</label>
            <label className="radio-option"><input type="radio" name="payment" /> {t("checkout.pay_card")}</label>
          </div>

          <button type="submit" className="btn-checkout-submit" disabled={loading}>
            {loading ? t("checkout.processing") : `${t("checkout.confirm_btn")} — `}
            {!loading && <span suppressHydrationWarning>{formatPrice(total)}</span>}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>{t("checkout.your_order")}</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-row">
              <img src={item.imageUrl || `https://picsum.photos/seed/${item.id}/50/50`} alt={item.title} />
              <div className="summary-info">
                <span>{item.title}</span>
                <span className="summary-qty">× {item.quantity}</span>
              </div>
              <span className="summary-price" suppressHydrationWarning>
                {formatPrice(safePrice(item.price) * item.quantity)}
              </span>
            </div>
          ))}
          <div className="summary-line">
            <span>{t("checkout.products")}</span>
            <span suppressHydrationWarning>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-line discount">
              <span>{t("checkout.discount")} {discount}%</span>
              <span suppressHydrationWarning>−{formatPrice(discountAmt)}</span>
            </div>
          )}
          <div className="summary-line total">
            <span>{t("checkout.total")}</span>
            <strong suppressHydrationWarning>{formatPrice(total)}</strong>
          </div>
          <div className="checkout-trust">
            <span>{t("checkout.trust_pay")}</span>
            <span>{t("checkout.trust_delivery")}</span>
            <span>{t("checkout.trust_return")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
