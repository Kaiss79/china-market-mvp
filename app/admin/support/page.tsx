export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { updateTicketStatus } from "./actions";

export default async function AdminSupportPage() {
  let tickets: Awaited<ReturnType<typeof prisma.supportTicket.findMany>> = [];

  try {
    tickets = await prisma.supportTicket.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("DB error on admin/support:", e);
  }

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const closedCount = tickets.filter((t) => t.status !== "OPEN").length;

  return (
    <div className="page-wrap">
      <div className="dash-header">
        <div>
          <h1 className="page-title">🎧 Обращения поддержки</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Все заявки от покупателей и продавцов</p>
        </div>
        <Link href="/admin" className="btn-secondary">← Admin</Link>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{tickets.length}</div>
          <div className="stat-label">Всего</div>
        </div>
        <div className="stat-box stat-ai">
          <div className="stat-icon">🔴</div>
          <div className="stat-value">{openCount}</div>
          <div className="stat-label">Открытых</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{closedCount}</div>
          <div className="stat-label">Закрытых</div>
        </div>
      </div>

      <div className="admin-list">
        {tickets.length === 0 ? (
          <div className="empty-state">
            <div>📭</div>
            <h3>Обращений пока нет</h3>
            <p>Заявки от пользователей появятся здесь</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>{ticket.topic}</h3>
                  <span className="order-date">{new Date(ticket.createdAt).toLocaleString("ru-RU")}</span>
                </div>
                <span className={`status-badge status-${ticket.status}`}>
                  {ticket.status === "OPEN" ? "Открыто" : "Закрыто"}
                </span>
              </div>
              <div className="order-meta">
                <span>👤 {ticket.name}</span>
                <span>📧 {ticket.email}</span>
              </div>
              <p style={{ color: "#374151", fontSize: "14px", margin: "10px 0 0", lineHeight: "1.6" }}>
                {ticket.message}
              </p>
              <form action={updateTicketStatus.bind(null, ticket.id)} className="order-status-form">
                <select name="status" defaultValue={ticket.status}>
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <button type="submit">Обновить</button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
