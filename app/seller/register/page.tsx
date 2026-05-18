import { createSeller } from "./actions";

export default function SellerRegisterPage() {
  return (
    <main className="market-page">
      <section className="seller-register">
        <div className="seller-box">
          <div className="seller-badge">
            🚀 Seller Marketplace
          </div>

          <h1>Регистрация продавца</h1>

          <p>
            Подключитесь к China Market и начните продавать товары по всему СНГ.
          </p>

          <form action={createSeller} className="seller-form">
            <input
              name="name"
              type="text"
              placeholder="Ваше имя"
              required
            />

            <input
              name="shopName"
              type="text"
              placeholder="Название магазина"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
            />

            <input
              name="phone"
              type="text"
              placeholder="Телефон"
              required
            />

            <select name="category" required>
              <option value="">Выберите категорию</option>
              <option value="Электроника">Электроника</option>
              <option value="Одежда">Одежда</option>
              <option value="Автотовары">Автотовары</option>
              <option value="Гаджеты">Гаджеты</option>
              <option value="Техника">Техника</option>
            </select>

            <textarea
              name="description"
              placeholder="Расскажите о вашем магазине"
            />

            <button type="submit">
              Подать заявку
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}