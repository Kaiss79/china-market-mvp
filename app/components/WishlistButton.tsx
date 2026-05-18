"use client";

import { useEffect, useState } from "react";

type WishItem = { id: string; title: string; price: number; imageUrl?: string | null; sellerName?: string };

export default function WishlistButton({ product }: { product: WishItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list: WishItem[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setSaved(list.some((i) => i.id === product.id));
  }, [product.id]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const list: WishItem[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const updated = saved
      ? list.filter((i) => i.id !== product.id)
      : [...list, product];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setSaved(!saved);
  }

  return (
    <button onClick={toggle} className={`wishlist-btn ${saved ? "saved" : ""}`} title={saved ? "Убрать из избранного" : "В избранное"}>
      {saved ? "❤️" : "🤍"}
    </button>
  );
}
