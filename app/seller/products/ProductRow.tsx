"use client";

import { useState } from "react";
import { updateSellerProduct, deleteSellerProduct } from "./actions";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  sellerName: string;
};

export default function ProductRow({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (editing) {
    return (
      <div className="product-row editing">
        <form
          action={updateSellerProduct.bind(null, product.id)}
          className="edit-form"
          onSubmit={() => setEditing(false)}
        >
          <div className="edit-grid">
            <div className="form-field">
              <label>Название</label>
              <input name="title" defaultValue={product.title} required />
            </div>
            <div className="form-field">
              <label>Цена (грн)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={(product.price / 100).toFixed(2)}
                required
              />
            </div>
            <div className="form-field">
              <label>Остаток</label>
              <input name="stock" type="number" defaultValue={product.stock} required />
            </div>
            <div className="form-field">
              <label>Фото (URL)</label>
              <input name="imageUrl" defaultValue={product.imageUrl || ""} />
            </div>
          </div>
          <div className="form-field">
            <label>Описание</label>
            <textarea name="description" defaultValue={product.description} rows={2} required />
          </div>
          <div className="edit-actions">
            <button type="submit" className="btn-primary">Сохранить</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="product-row">
      <img
        src={product.imageUrl || "https://via.placeholder.com/60"}
        alt={product.title}
        className="product-row-img"
      />
      <div className="product-row-info">
        <strong>{product.title}</strong>
        <span className="product-row-desc">{product.description}</span>
        <span className="product-row-seller">Продавец: {product.sellerName}</span>
      </div>
      <div className="product-row-meta">
        <span className="product-row-price">{(product.price / 100).toFixed(2)} грн</span>
        <span className="product-row-stock">Остаток: {product.stock} шт.</span>
      </div>
      <div className="product-row-actions">
        <button className="btn-edit" onClick={() => setEditing(true)}>
          ✏️ Ред.
        </button>
        <form
          action={async () => {
            setDeleting(true);
            await deleteSellerProduct(product.id);
          }}
          style={{ display: "inline" }}
        >
          <button type="submit" className="btn-delete" disabled={deleting}>
            {deleting ? "..." : "🗑️"}
          </button>
        </form>
      </div>
    </div>
  );
}
