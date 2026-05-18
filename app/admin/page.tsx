import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [
    ordersCount,
    sellersCount,
    productsCount,
    ticketsCount,
    revenueData,
    recentOrders,
    recentTickets,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.seller.count(),
    prisma.sellerProduct.count(),
    prisma.supportTicket.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.supportTicket.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      where: { status: "OPEN" },
    }),
  ]);

  const revenue = revenueData._sum.total ?? 0;
  const openTickets = recentTickets.length;

  return (
    <main className="page-container">
      <div className="dash-header">
        <div>
          <div className="page-badge">⚙️ Админ-панель</div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Полная статистика платформы China Market</p>
        </div>
        <div className="admin-quick-links">
          <Link href="/admin/orders" className="btn-secondary">📦 Заказы</Link>
          <Link href="/admin/sellers" className="btn-secondary">🏪 Продавцы</Link>
          <Link href="/admin/support" className="btn-secondary">🎧 Поддержка</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card highlight">
          <div className="admin-stat-icon">💰</div>
          <div className="admin-stat-value">{(revenue / 100).toFixed(0)} грн</div>
          <div className="admin-stat-label">Общая выручка</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-value">{ordersCount}</div>
          <div className="admin-stat-label">Заказов</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🏪</div>
          <div className="admin-stat-value">{sellersCount}</div>
          <div className="admin-stat-label">Продавцов</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🛍️</div>
          <div className="admin-stat-value">{productsCount}</div>
          <div className="admin-stat-label">Товаров</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🎧</div>
          <div className="admin-stat-value">{ticketsCount}</div>
          <div className="admin-stat-label">Обращений</div>
        </div>
      </div>

      <div className="admin-content-grid">
        {/* Recent Orders */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>📦 Последние заказы</h2>
            <Link href="/admin/orders" className="panel-link">Все заказы →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="panel-empty">Заказов пока нет</div>
          ) : (
            <div className="panel-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="panel-row">
                  <div className="panel-row-main">
                    <span className="panel-name">{order.name}</span>
                    <span className="panel-date">
                      {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="panel-row-right">
                    <span className="panel-amount">{(order.total / 100).toFixed(2)} грн</span>
                    <span className="panel-status status-new">Новый</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open Tickets */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>🎧 Открытые обращения</h2>
            <Link href="/admin/support" className="panel-link">Все обращения →</Link>
          </div>
          {recentTickets.length === 0 ? (
            <div className="panel-empty">Открытых обращений нет</div>
          ) : (
            <div className="panel-list">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="panel-row">
                  <div className="panel-row-main">
                    <span className="panel-name">{ticket.topic}</span>
                    <span className="panel-date">{ticket.name}</span>
                  </div>
                  <span className="panel-status status-open">Открыто</span>
                </div>
              ))}
            </div>
          )}
          {openTickets === 0 && (
            <div className="panel-all-good">✅ Всё обращения обработаны</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-actions-grid">
        <Link href="/admin/orders" className="admin-action-card">
          <span>📦</span>
          <div>
            <strong>Управление заказами</strong>
            <p>Просмотр и обработка заказов покупателей</p>
          </div>
        </Link>
        <Link href="/admin/sellers" className="admin-action-card">
          <span>🏪</span>
          <div>
            <strong>Продавцы платформы</strong>
            <p>Заявки и активные продавцы</p>
          </div>
        </Link>
        <Link href="/admin/support" className="admin-action-card">
          <span>🎧</span>
          <div>
            <strong>Поддержка</strong>
            <p>Обращения покупателей и продавцов</p>
          </div>
        </Link>
        <Link href="/seller/products" className="admin-action-card">
          <span>🛍️</span>
          <div>
            <strong>Товары</strong>
            <p>Управление каталогом маркетплейса</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
