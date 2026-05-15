import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
}

export async function getProducts(filters: ProductFilters = {}) {
  const {
    categorySlug,
    search,
    minPrice,
    maxPrice,
    onSale,
    featured,
    page = 1,
    limit = 12,
    sort = "newest",
  } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(minPrice !== undefined && { price: { gte: minPrice } }),
    ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    ...(onSale && { salePrice: { not: null } }),
    ...(featured && { isFeatured: true }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput = ({
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    rating: { ratingAvg: "desc" },
    newest: { createdAt: "desc" },
    popular: { salesCount: "desc" },
  } as Record<string, Prisma.ProductOrderByWithRelationInput>)[sort];

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
        tags: { select: { name: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
      tags: { select: { name: true } },
      reviews: {
        where: { isApproved: true },
        include: {
          user: { select: { firstName: true, lastName: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: {
      category: { select: { name: true, slug: true } },
      images: { where: { isPrimary: true }, take: 1 },
      tags: { select: { name: true } },
    },
    orderBy: { ratingAvg: "desc" },
    take: limit,
  });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { where: { isPrimary: true }, take: 1 },
      tags: { select: { name: true } },
    },
    orderBy: { ratingAvg: "desc" },
    take: limit,
  });
}

export async function getSaleProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true, salePrice: { not: null } },
    include: {
      category: { select: { name: true, slug: true } },
      images: { where: { isPrimary: true }, take: 1 },
      tags: { select: { name: true } },
    },
    orderBy: { ratingAvg: "desc" },
    take: limit,
  });
}
