import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="page-wrap">
      <div className="success-page">
        <div className="success-icon">🎉</div>
        <h1>Заказ оформлен!</h1>
        <p>Спасибо за покупку. Менеджер свяжется с вами в течение 30 минут для подтверждения доставки.</p>
        <div className="success-steps">
          <div className="success-step"><span>📞</span><div><strong>Подтверждение</strong><p>Менеджер позвонит вам в течение 30 минут</p></div></div>
          <div className="success-step"><span>📦</span><div><strong>Отправка</strong><p>Новой Почтой или Укрпочтой — 2–5 рабочих дней</p></div></div>
          <div className="success-step"><span>✅</span><div><strong>Получение</strong><p>Наложенный платёж или онлайн-оплата</p></div></div>
        </div>
        <div className="success-actions">
          <Link href="/" className="btn-primary">Продолжить покупки</Link>
          <Link href="/support" className="btn-secondary">Написать в поддержку</Link>
        </div>
      </div>
    </div>
  );
}
