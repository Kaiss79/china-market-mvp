"use client";

import { useState } from "react";

export default function ReviewForm({ productId }: { productId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("productId", productId);
    data.set("rating", String(rating));

    const { addReview } = await import("@/app/actions/reviews");
    await addReview(data);
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="review-success">
        ✅ Спасибо за отзыв! Он появится на странице товара.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Оставить отзыв</h4>
      <div className="rating-select">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}
            className={`star-btn ${n <= rating ? "active" : ""}`}>★</button>
        ))}
        <span>{rating} / 5</span>
      </div>
      <div className="form-field">
        <input name="customer" placeholder="Ваше имя" required />
      </div>
      <div className="form-field">
        <textarea name="text" placeholder="Расскажите о товаре..." rows={3} required />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Отправляем..." : "Отправить отзыв"}
      </button>
    </form>
  );
}
