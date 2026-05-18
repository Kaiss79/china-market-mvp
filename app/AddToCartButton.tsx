"use client";

import { useState } from "react";
import { useSettings } from "./components/SettingsProvider";

export type CartProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string | null;
  sellerName?: string;
};

export default function AddToCartButton({ product }: { product: CartProduct }) {
  const { t } = useSettings();
  const [added, setAdded] = useState(false);

  function addToCart() {
    if (!product?.id || !product?.title) return;

    const price = Number(product.price);
    if (isNaN(price) || price <= 0) return;

    type CartItem = CartProduct & { quantity: number };
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);

    const updated = existing
      ? cart.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...product, price, quantity: 1 }];

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button onClick={addToCart} className={`add-to-cart-btn ${added ? "added" : ""}`}>
      {added ? t("common.added") : t("common.add_to_cart")}
    </button>
  );
}
