"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { sendTelegramMessage } from "@/lib/telegram";

const PROMO_CODES: Record<string, number> = {
  CHINA10: 10,
};

export async function createOrder(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const comment = String(formData.get("comment") || "").trim();
  const promoCode = String(formData.get("promoCode") || "").trim().toUpperCase();
  const itemsJson = String(formData.get("items") || "[]");
  const rawTotal = Number(formData.get("total") || 0);

  const discountPercent = PROMO_CODES[promoCode] ?? 0;
  const discount = discountPercent > 0 ? Math.round(rawTotal * discountPercent / 100) : 0;
  const total = rawTotal - discount;

  let items: { title: string; quantity: number; price: number }[] = [];
  try { items = JSON.parse(itemsJson); } catch {}

  const itemsList = items
    .map((i) => `  • ${i.title} ×${i.quantity} — ${(i.price * i.quantity / 100).toFixed(2)} грн`)
    .join("\n");

  const order = await prisma.order.create({
    data: {
      name,
      phone,
      email,
      address,
      comment: comment || null,
      total: Math.round(total),
      discount: Math.round(discount),
      promoCode: promoCode || null,
      items: itemsJson,
      status: "NEW",
    },
  });

  await sendTelegramMessage(
    `📦 <b>Новый заказ!</b>\n\n` +
    `👤 Клиент: ${order.name}\n` +
    `📞 Телефон: ${order.phone}\n` +
    `📧 Email: ${order.email}\n` +
    `📍 Адрес: ${order.address}\n` +
    `💰 Сумма: ${(order.total / 100).toFixed(2)} грн\n` +
    (order.discount > 0 ? `🎟 Скидка: ${(order.discount / 100).toFixed(2)} грн (${promoCode})\n` : "") +
    `🛒 Товары:\n${itemsList}\n` +
    `🆔 ID: ${order.id}`
  );

  redirect("/checkout/success");
}
