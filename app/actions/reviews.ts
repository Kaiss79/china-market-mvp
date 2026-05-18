"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addReview(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  const customer = String(formData.get("customer") || "Аноним").trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") || 5)));
  const text = String(formData.get("text") || "").trim();

  if (!productId || !text) return;

  await prisma.review.create({ data: { productId, customer, rating, text } });

  const reviews = await prisma.review.findMany({ where: { productId } });
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  await prisma.sellerProduct.update({
    where: { id: productId },
    data: { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length },
  });

  revalidatePath(`/product/${productId}`);
}
