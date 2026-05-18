"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { sendTelegramMessage } from "@/lib/telegram";

export async function createSeller(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const shopName = String(formData.get("shopName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const seller = await prisma.seller.create({
    data: { name, shopName, email, phone, category, description: description || null, status: "PENDING" },
  });

  await sendTelegramMessage(
    `🏪 <b>Новая заявка продавца!</b>\n\n` +
    `🏬 Магазин: ${seller.shopName}\n` +
    `👤 Владелец: ${seller.name}\n` +
    `📧 Email: ${seller.email}\n` +
    `📞 Телефон: ${seller.phone}\n` +
    `📦 Категория: ${seller.category}\n` +
    `🆔 ID: ${seller.id}`
  );

  redirect("/seller/dashboard");
}
