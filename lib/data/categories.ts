import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      children: { where: { isActive: true } },
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
}
