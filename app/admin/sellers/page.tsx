export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { updateSellerStatus, toggleVerified } from "./actions";

export default async function AdminSellersPage() {
  const sellers = await prisma.seller.findMany({ orderBy: { createdAt: "desc" } });
  const pending = sellers.filter((s) => s.status === "PENDING").length;
  const approved = sellers.filter((s) => s.status === "APPROVED").length;

  return (
    <div className="page-wrap">
      <div className="dash-header">
        <div>
          <h1 className="page-title">🏪 Продавцы</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Заявки и активные продавцы платформы</p>
        </div>
        <Link href="/admin" className="btn-secondary">← Admin</Link>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{sellers.length}</div>
          <div className="stat-label">Всего продавцов</div>
        </div>
        <div className="stat-box stat-ai">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{pending}</div>
          <div className="stat-label">На рассмотрении</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{approved}</div>
          <div className="stat-label">Одобрено</div>
        </div>
      </div>

      <div className="admin-list">
        {sellers.length === 0 ? (
          <div className="empty-state">
            <div>🏪</div>
            <h3>Продавцов пока нет</h3>
            <p>Заявки продавцов появятся здесь</p>
          </div>
        ) : (
          sellers.map((seller) => (
            <div key={seller.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>{seller.shopName}</h3>
                  <span className="order-date">
                    {new Date(seller.createdAt).toLocaleString("ru-RU")}
                  </span>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                  <span className={`status-badge status-${seller.status}`}>{seller.status}</span>
                  {seller.verified && <span className="status-badge status-DELIVERED">✅ Verified</span>}
                </div>
              </div>

              <div className="order-meta">
                <span>👤 {seller.name}</span>
                <span>📧 {seller.email}</span>
                <span>📞 {seller.phone}</span>
                <span>🗂 {seller.category}</span>
                <span>⭐ {seller.rating.toFixed(1)}</span>
              </div>

              {seller.description && (
                <p style={{ color: "#374151", fontSize: "14px", margin: "8px 0 0" }}>
                  {seller.description}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                <form action={updateSellerStatus.bind(null, seller.id)} className="order-status-form">
                  <select name="status" defaultValue={seller.status}>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                  <button type="submit">Обновить</button>
                </form>

                <form action={toggleVerified.bind(null, seller.id, !seller.verified)}>
                  <button type="submit" className="btn-secondary" style={{ fontSize: "13px", padding: "6px 14px" }}>
                    {seller.verified ? "Снять верификацию" : "✅ Верифицировать"}
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
