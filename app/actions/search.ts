"use server";

import { prisma } from "@/lib/db";

export type SearchProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  imageUrl: string | null;
  sellerName: string;
  category: string;
  rating: number;
  stock: number;
  isTrending: boolean;
};

export async function aiSearchProducts(query: string): Promise<SearchProduct[]> {
  if (!query.trim()) return [];

  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (!words.length) return [];

  const products = await prisma.sellerProduct.findMany({
    where: {
      OR: words.flatMap((word) => [
        { title: { contains: word } },
        { description: { contains: word } },
        { category: { contains: word } },
        { sellerName: { contains: word } },
      ]),
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return products;
}
