export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function SellerDashboardPage() {
  const productsCount = await prisma.sellerProduct.count();
  const ordersCount = await prisma.order.count();
  const sellersCount = await prisma.seller.count();

  const recentProducts = await prisma.sellerProduct.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const aiRating = productsCount > 0 ? Math.min(95, 70 + productsCount * 3) : 0;

  return (
    <main className="page-container">
      <div className="dash-header">
        <div>
          <div className="page-badge">🚀 Seller Dashboard</div>
          <h1 className="page-title">Кабинет продавца</h1>
          <p className="page-subtitle">Управление товарами, аналитикой и AI-инструментами</p>
        </div>
        <Link href="/seller/products" className="btn-primary">+ Добавить товар</Link>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{productsCount}</div>
          <div className="stat-label">Товаров</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🛒</div>
          <div className="stat-value">{ordersCount}</div>
          <div className="stat-label">Заказов</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🏪</div>
          <div className="stat-value">{sellersCount}</div>
          <div className="stat-label">Продавцов</div>
        </div>
        <div className="stat-box stat-ai">
          <div className="stat-icon">🤖</div>
          <div className="stat-value">{aiRating}%</div>
          <div className="stat-label">AI рейтинг</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>📦 Мои товары</h3>
          <p>Управляйте каталогом товаров на маркетплейсе</p>
          <div className="recent-list">
            {recentProducts.length === 0 ? (
              <p className="empty-hint">Товаров пока нет</p>
            ) : (
              recentProducts.map((p) => (
                <div key={p.id} className="recent-item">
                  <span>{p.title}</span>
                  <span className="recent-price">{(p.price / 100).toFixed(2)} грн</span>
                </div>
              ))
            )}
          </div>
          <Link href="/seller/products" className="btn-primary" style={{ marginTop: 16, display: "block", textAlign: "center" }}>
            Управлять товарами
          </Link>
        </div>

        <div className="dash-card">
          <h3>🤖 AI Аналитика</h3>
          <p>Анализ спроса, цен и конкурентов на рынке</p>
          <div className="ai-analysis">
            <div className="ai-metric">
              <span>📈 Спрос на электронику</span>
              <div className="ai-bar"><div style={{ width: "78%" }} /></div>
              <span>78%</span>
            </div>
            <div className="ai-metric">
              <span>🔥 Тренд: гаджеты</span>
              <div className="ai-bar"><div style={{ width: "92%" }} /></div>
              <span>92%</span>
            </div>
            <div className="ai-metric">
              <span>💰 Конкурентность цен</span>
              <div className="ai-bar"><div style={{ width: "65%" }} /></div>
              <span>65%</span>
            </div>
          </div>
          <div className="ai-tip">
            💡 <strong>AI рекомендует:</strong> Добавьте больше электроники — спрос вырос на 23% за неделю
          </div>
        </div>

        <div className="dash-card">
          <h3>💬 Поддержка</h3>
          <p>Связь с менеджерами платформы</p>
          <div className="support-quick">
            <div className="support-item">📞 Телефон: +38 (044) 123-45-67</div>
            <div className="support-item">📧 Email: sellers@chinamarket.ua</div>
            <div className="support-item">💬 Telegram: @chinamarket_support</div>
          </div>
          <Link href="/support" className="btn-secondary" style={{ marginTop: 16, display: "block", textAlign: "center" }}>
            Написать в поддержку
          </Link>
        </div>
      </div>

      <div className="dash-nav">
        <Link href="/seller/register" className="dash-link">
          <span>🏪</span>
          <div>
            <strong>Регистрация магазина</strong>
            <p>Подать заявку на продавца</p>
          </div>
        </Link>
        <Link href="/admin/orders" className="dash-link">
          <span>📦</span>
          <div>
            <strong>Все заказы</strong>
            <p>Просмотр заказов платформы</p>
          </div>
        </Link>
        <Link href="/admin/sellers" className="dash-link">
          <span>👥</span>
          <div>
            <strong>Продавцы</strong>
            <p>Список продавцов платформы</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
