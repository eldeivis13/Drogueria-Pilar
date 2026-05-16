"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice, calcDiscount } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number | { toNumber: () => number };
  salePrice?: number | { toNumber: () => number } | null;
  ratingAvg: number;
  ratingCount: number;
  stock: number;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  tags: { name: string }[];
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

const EMOJI_MAP: Record<string, string> = {
  perfumeria: "🌸",
  skincare: "🧴",
  maquillaje: "💄",
  vitaminas: "🌿",
  medicamentos: "💊",
  bebes: "👶",
  "higiene-oral": "🦷",
  hogar: "🏠",
};

const BADGE_STYLES: Record<string, string> = {
  oferta: "bg-red-500 text-white",
  nuevo: "bg-blue-500 text-white",
  popular: "bg-[#7C3AED] text-white",
  destacado: "bg-amber-500 text-white",
};

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images[0];
  const emoji = EMOJI_MAP[product.category.slug] ?? "🛍️";
  const firstTag = product.tags[0];
  const discount = product.salePrice
    ? calcDiscount(product.price, product.salePrice)
    : null;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
        className
      )}
    >
      {/* Badge */}
      {firstTag && (
        <Badge
          className={cn(
            "absolute top-3 left-3 z-10 text-xs font-medium px-2 py-0.5 capitalize",
            BADGE_STYLES[firstTag.name] ?? "bg-gray-500 text-white"
          )}
        >
          {firstTag.name}
        </Badge>
      )}

      {/* Descuento */}
      {discount && (
        <Badge className="absolute top-3 right-9 z-10 bg-red-100 text-red-600 text-xs font-semibold border-0">
          -{discount}%
        </Badge>
      )}

      {/* Wishlist */}
      <button className="absolute top-3 right-3 z-10 h-7 w-7 flex items-center justify-center rounded-full bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
        <Heart className="h-4 w-4" />
      </button>

      {/* Imagen */}
      <Link href={`/productos/${product.slug}`}>
        <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage.url}
              alt={primaryImage.altText ?? product.name}
              className="h-36 w-36 object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                const fallback = img.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "block";
              }}
            />
          ) : null}
          <span
            className="text-5xl"
            style={{ display: primaryImage ? "none" : "block" }}
          >
            {emoji}
          </span>
          <div className="absolute inset-0 bg-[#2D1B69] opacity-0 group-hover:opacity-5 transition-opacity" />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs text-purple-500 font-medium uppercase tracking-wide">
          {product.brand ?? product.category.name}
        </p>

        <Link href={`/productos/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#2D1B69] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "h-3.5 w-3.5",
                  s <= Math.round(product.ratingAvg)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.ratingCount})</span>
        </div>

        {/* Precio */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-[#2D1B69]">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.stock <= 8 && product.stock > 0 && (
          <p className="text-xs text-orange-500 font-medium">
            ¡Solo {product.stock} disponibles!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-500 font-medium">Agotado</p>
        )}

        <AddToCartButton
          productId={product.id}
          size="sm"
          className="w-full mt-1 h-9 text-sm"
        />
      </div>
    </div>
  );
}
