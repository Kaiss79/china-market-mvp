import { createSupportTicket } from "./actions";
import AIAssistant from "@/app/components/AIAssistant";

export default function SupportPage() {
  return (
    <main className="page-container">
      <div className="support-hero">
        <div className="page-badge">🎧 Центр поддержки</div>
        <h1 className="page-title">Как мы можем помочь?</h1>
        <p className="page-subtitle">Наша команда и AI-ассистент готовы помочь 24/7</p>
      </div>

      <div className="support-grid">
        <div className="support-options">
          <div className="support-option-card">
            <div className="support-option-icon">🤖</div>
            <h3>AI-ассистент</h3>
            <p>Найдите товар или задайте вопрос — AI ответит мгновенно</p>
            <AIAssistant />
          </div>

          <div className="support-option-card">
            <div className="support-option-icon">📞</div>
            <h3>Прямая связь</h3>
            <p>Свяжитесь с менеджером напрямую</p>
            <div className="contact-list">
              <div className="contact-item">
                <strong>📞 Телефон</strong>
                <span>+38 (044) 123-45-67</span>
              </div>
              <div className="contact-item">
                <strong>📧 Email</strong>
                <span>support@chinamarket.ua</span>
              </div>
              <div className="contact-item">
                <strong>💬 Telegram</strong>
                <span>@chinamarket_bot</span>
              </div>
              <div className="contact-item">
                <strong>🕐 Режим работы</strong>
                <span>Пн–Пт 9:00–21:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="support-form-wrap">
          <div className="support-form-card">
            <h2>Написать обращение</h2>
            <p>Опишите ваш вопрос и мы ответим в течение 2 часов</p>

            <form action={createSupportTicket} className="support-form">
              <div className="form-field">
                <label>Ваше имя *</label>
                <input name="name" placeholder="Иван Петров" required />
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input name="email" type="email" placeholder="ivan@gmail.com" required />
              </div>
              <div className="form-field">
                <label>Тема обращения *</label>
                <select name="topic" required>
                  <option value="">Выберите тему</option>
                  <option value="Вопрос о заказе">Вопрос о заказе</option>
                  <option value="Проблема с доставкой">Проблема с доставкой</option>
                  <option value="Возврат товара">Возврат товара</option>
                  <option value="Работа продавца">Работа продавца</option>
                  <option value="Технический вопрос">Технический вопрос</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <div className="form-field">
                <label>Сообщение *</label>
                <textarea name="message" placeholder="Опишите ваш вопрос или проблему..." rows={5} required />
              </div>
              <button type="submit" className="btn-primary submit-full">
                Отправить обращение
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2>Частые вопросы</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Как отследить заказ?</h4>
            <p>После оформления заказа менеджер отправит номер ТТН Новой Почты на ваш телефон.</p>
          </div>
          <div className="faq-item">
            <h4>Можно ли вернуть товар?</h4>
            <p>Да, в течение 14 дней с момента получения при наличии полной комплектации.</p>
          </div>
          <div className="faq-item">
            <h4>Как стать продавцом?</h4>
            <p>Заполните форму регистрации, наш менеджер рассмотрит заявку в течение 24 часов.</p>
          </div>
          <div className="faq-item">
            <h4>Какие способы оплаты?</h4>
            <p>Принимаем оплату картой онлайн, наличными при получении (Наложенный платёж).</p>
          </div>
        </div>
      </div>
    </main>
  );
}
