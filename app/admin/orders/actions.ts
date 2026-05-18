"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(id: string, formData: FormData) {
  const status = String(formData.get("status") || "NEW");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}
