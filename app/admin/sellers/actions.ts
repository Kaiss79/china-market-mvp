"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSellerStatus(id: string, formData: FormData) {
  const status = String(formData.get("status") || "PENDING");
  await prisma.seller.update({ where: { id }, data: { status } });
  revalidatePath("/admin/sellers");
}

export async function toggleVerified(id: string, verified: boolean) {
  await prisma.seller.update({ where: { id }, data: { verified } });
  revalidatePath("/admin/sellers");
}
