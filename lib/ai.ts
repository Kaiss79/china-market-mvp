// Placeholder for future OpenAI integration.
// Currently uses rule-based logic.

export function generateAIResponse(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("заказ") || m.includes("где") || m.includes("доставк")) {
    return "После оформления заказа наш менеджер свяжется с вами в течение 30 минут и подтвердит доставку. Срок — 2–5 рабочих дней.";
  }
  if (m.includes("продавец") || m.includes("продавать") || m.includes("магазин")) {
    return "Чтобы стать продавцом, заполните форму регистрации на странице /seller/register. Заявка рассматривается в течение 24 часов.";
  }
  if (m.includes("возврат")) {
    return "Возврат товара возможен в течение 14 дней с момента получения при наличии полной комплектации и товарного вида.";
  }
  if (m.includes("оплат") || m.includes("плат")) {
    return "Принимаем оплату наложенным платежом при получении и картой онлайн (Visa/Mastercard).";
  }
  if (m.includes("тренд") || m.includes("популярн")) {
    return "Сейчас в тренде: беспроводные наушники, powerbank, умные часы и гаджеты для авто. Смотрите раздел «Trending» на главной.";
  }
  if (m.includes("поддержк") || m.includes("помощ") || m.includes("контакт")) {
    return "Наша поддержка работает Пн–Пт 9:00–21:00. Напишите на /support или в Telegram @chinamarket_support.";
  }
  if (m.includes("цена") || m.includes("дешев") || m.includes("скидк")) {
    return "Используйте промокод CHINA10 при оформлении заказа для скидки 10%. Также следите за отметкой 🔥 на карточках товаров.";
  }
  return "Я AI-ассистент China Market. Могу помочь найти товар, ответить на вопрос о заказе или рассказать о работе с платформой. Уточните ваш вопрос.";
}

export const AI_QUICK_QUESTIONS = [
  "Где мой заказ?",
  "Как стать продавцом?",
  "Какие товары в тренде?",
  "Как оформить возврат?",
  "Есть ли скидки?",
  "Как связаться с поддержкой?",
];
