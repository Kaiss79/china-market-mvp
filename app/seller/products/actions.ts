"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { grnToKopecks } from "@/lib/money";

export async function createSellerProduct(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "Другое");
  const price = grnToKopecks(formData.get("price"));
  const oldPrice = formData.get("oldPrice") ? grnToKopecks(formData.get("oldPrice")) : null;
  const stock = Number(formData.get("stock") || 0);
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
  const sellerName = String(formData.get("sellerName") || "Demo Seller").trim();

  await prisma.sellerProduct.create({
    data: { title, description, category, price, oldPrice, stock, imageUrl, sellerName },
  });

  revalidatePath("/seller/products");
  revalidatePath("/");
}

export async function updateSellerProduct(id: string, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "Другое");
  const price = grnToKopecks(formData.get("price"));
  const oldPrice = formData.get("oldPrice") ? grnToKopecks(formData.get("oldPrice")) : null;
  const stock = Number(formData.get("stock") || 0);
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;

  await prisma.sellerProduct.update({
    where: { id },
    data: { title, description, category, price, oldPrice, stock, imageUrl },
  });

  revalidatePath("/seller/products");
  revalidatePath("/");
}

export async function deleteSellerProduct(id: string) {
  await prisma.sellerProduct.delete({ where: { id } });
  revalidatePath("/seller/products");
  revalidatePath("/");
}
