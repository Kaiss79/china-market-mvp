import { prisma } from "@/lib/db";
import { createSellerProduct } from "./actions";
import Link from "next/link";
import ProductRow from "./ProductRow";

export default async function SellerProductsPage() {
  const [products, ordersData] = await Promise.all([
    prisma.sellerProduct.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const totalRevenue = ordersData._sum.total ?? 0;

  return (
    <main className="page-container">
      <div className="dash-header">
        <div>
          <div className="page-badge">📦 Seller Products</div>
          <h1 className="page-title">Управление товарами</h1>
          <p className="page-subtitle">Добавление, редактирование и удаление товаров</p>
        </div>
        <Link href="/seller/dashboard" className="btn-secondary">← Dashboard</Link>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-box">
          <div className="stat-icon">🛍️</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Товаров</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{products.reduce((s, p) => s + p.stock, 0)}</div>
          <div className="stat-label">Единиц в наличии</div>
        </div>
        <div className="stat-box stat-ai">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{(totalRevenue / 100).toFixed(0)} грн</div>
          <div className="stat-label">Сумма продаж</div>
        </div>
      </div>

      {/* Add product form */}
      <div className="add-product-panel">
        <h2>➕ Добавить товар</h2>
        <form action={createSellerProduct} className="add-product-form">
          <div className="add-form-grid">
            <div className="form-field">
              <label>Продавец *</label>
              <input name="sellerName" placeholder="Имя продавца" required />
            </div>
            <div className="form-field">
              <label>Название товара *</label>
              <input name="title" placeholder="Например: Наушники Sony WH-1000XM4" required />
            </div>
            <div className="form-field">
              <label>Категория *</label>
              <select name="category" required>
                <option value="">Выберите категорию</option>
                <option value="Электроника">Электроника</option>
                <option value="Гаджеты">Гаджеты</option>
                <option value="Авто">Авто</option>
                <option value="Дом">Дом</option>
                <option value="Одежда">Одежда</option>
                <option value="Красота">Красота</option>
                <option value="Спорт">Спорт</option>
                <option value="Gaming">Gaming</option>
                <option value="Инструменты">Инструменты</option>
                <option value="Дети">Дети</option>
                <option value="Офис">Офис</option>
                <option value="Аксессуары">Аксессуары</option>
              </select>
            </div>
            <div className="form-field">
              <label>Цена (грн) *</label>
              <input name="price" type="number" step="0.01" placeholder="1299.00" required />
            </div>
            <div className="form-field">
              <label>Старая цена (грн)</label>
              <input name="oldPrice" type="number" step="0.01" placeholder="1599.00" />
            </div>
            <div className="form-field">
              <label>Остаток *</label>
              <input name="stock" type="number" placeholder="50" required />
            </div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Фото (URL)</label>
              <input name="imageUrl" placeholder="https://..." />
            </div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Описание *</label>
              <textarea name="description" placeholder="Описание товара..." rows={2} required />
            </div>
          </div>
          <button type="submit" className="btn-primary">Добавить товар</button>
        </form>
      </div>

      {/* Product list */}
      <div className="products-panel">
        <h2>Список товаров ({products.length})</h2>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Товаров пока нет</h3>
            <p>Добавьте первый товар с помощью формы выше</p>
          </div>
        ) : (
          <div className="products-list">
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
