"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(id: string, formData: FormData) {
  const status = String(formData.get("status") || "OPEN");
  await prisma.supportTicket.update({ where: { id }, data: { status } });
  revalidatePath("/admin/support");
}
