"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { sendTelegramMessage } from "@/lib/telegram";

export async function createSupportTicket(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const topic = String(formData.get("topic") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const ticket = await prisma.supportTicket.create({
    data: { name, email, topic, message, status: "OPEN" },
  });

  await sendTelegramMessage(
    `🎧 <b>Новое обращение в поддержку</b>\n\n` +
    `👤 Имя: ${ticket.name}\n` +
    `📧 Email: ${ticket.email}\n` +
    `📋 Тема: ${ticket.topic}\n` +
    `💬 Сообщение: ${ticket.message}\n` +
    `🆔 ID: ${ticket.id}`
  );

  redirect("/support/success");
}
