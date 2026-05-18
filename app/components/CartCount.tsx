"use client";

import { useEffect, useState } from "react";

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function update() {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = cart.reduce((s: number, i: { quantity?: number }) => s + (Number(i.quantity) || 1), 0);
        setCount(total);
      } catch {
        setCount(0);
      }
    }
    update();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (count === 0) return null;
  return <span className="cart-count-badge">{count}</span>;
}
