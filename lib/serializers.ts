// Convierte objetos Prisma (con Decimal, Date, etc.) a objetos planos
// seguros para pasar de Server Components a Client Components.

import type { ProductCardData } from "@/components/products/ProductCard";

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: { toNumber: () => number } | number;
  salePrice?: { toNumber: () => number } | number | null;
  ratingAvg: number;
  ratingCount: number;
  stock: number;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  tags: { name: string }[];
};

export function serializeProduct(p: RawProduct): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    price: typeof p.price === "number" ? p.price : p.price.toNumber(),
    salePrice:
      p.salePrice == null
        ? null
        : typeof p.salePrice === "number"
        ? p.salePrice
        : p.salePrice.toNumber(),
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    stock: p.stock,
    category: p.category,
    images: p.images,
    tags: p.tags,
  };
}

export function serializeProducts(products: RawProduct[]): ProductCardData[] {
  return products.map(serializeProduct);
}
