export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { updateOrderStatus } from "./actions";

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];

  try {
    orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("DB error on admin/orders:", e);
  }

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const newCount = orders.filter((o) => o.status === "NEW").length;

  return (
    <div className="page-wrap">
      <div className="dash-header">
        <div>
          <h1 className="page-title">📦 Заказы</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Все входящие заказы маркетплейса</p>
        </div>
        <Link href="/admin" className="btn-secondary">← Admin</Link>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Всего заказов</div>
        </div>
        <div className="stat-box stat-ai">
          <div className="stat-icon">🆕</div>
          <div className="stat-value">{newCount}</div>
          <div className="stat-label">Новых</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{(totalRevenue / 100).toFixed(0)} грн</div>
          <div className="stat-label">Выручка</div>
        </div>
      </div>

      <div className="admin-list">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div>📭</div>
            <h3>Заказов пока нет</h3>
            <p>Заказы покупателей появятся здесь</p>
          </div>
        ) : (
          orders.map((order) => {
            let items: { title: string; quantity: number; price: number }[] = [];
            try { items = JSON.parse(order.items || "[]"); } catch {}

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3 style={{ margin: "0 0 4px" }}>{order.name}</h3>
                    <span className="order-date">{new Date(order.createdAt).toLocaleString("ru-RU")}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="order-total">{(order.total / 100).toFixed(2)} грн</div>
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  </div>
                </div>

                <div className="order-meta">
                  <span>📞 {order.phone}</span>
                  {order.email && <span>📧 {order.email}</span>}
                  <span>📍 {order.address}</span>
                  {order.promoCode && <span>🎟 {order.promoCode} (−{order.discount}%)</span>}
                </div>

                {items.length > 0 && (
                  <div className="order-items">
                    {items.map((item, i) => (
                      <div key={i} className="order-item">
                        <span>{item.title}</span>
                        <span>× {item.quantity}</span>
                        <span>{((item.price * item.quantity) / 100).toFixed(2)} грн</span>
                      </div>
                    ))}
                  </div>
                )}

                {order.comment && <div className="order-comment">💬 {order.comment}</div>}

                <form action={updateOrderStatus.bind(null, order.id)} className="order-status-form">
                  <select name="status" defaultValue={order.status}>
                    <option value="NEW">NEW</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <button type="submit">Обновить</button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
