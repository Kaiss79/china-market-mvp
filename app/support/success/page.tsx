import Link from "next/link";

export default function SupportSuccessPage() {
  return (
    <div className="page-wrap">
      <div className="success-page">
        <div className="success-icon">✅</div>
        <h1>Обращение отправлено!</h1>
        <p>Спасибо! Наша команда получила ваше сообщение и ответит в течение 2 часов.</p>
        <div className="success-steps">
          <div className="success-step">
            <span>📧</span>
            <div>
              <strong>Подтверждение</strong>
              <p>Проверьте email — мы отправили копию вашего обращения</p>
            </div>
          </div>
          <div className="success-step">
            <span>⏱</span>
            <div>
              <strong>Время ответа</strong>
              <p>Менеджер ответит в течение 2 часов в рабочее время</p>
            </div>
          </div>
          <div className="success-step">
            <span>💬</span>
            <div>
              <strong>Альтернатива</strong>
              <p>Для срочных вопросов — Telegram @chinamarket_bot</p>
            </div>
          </div>
        </div>
        <div className="success-actions">
          <Link href="/" className="btn-primary">На главную</Link>
          <Link href="/support" className="btn-secondary">Ещё вопрос</Link>
        </div>
      </div>
    </div>
  );
}
