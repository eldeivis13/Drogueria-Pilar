export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield, Truck, RotateCcw, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/products/ProductCard";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductImage } from "@/components/products/ProductImage";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { serializeProducts } from "@/lib/serializers";
import { formatPrice, calcDiscount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  const image = product.images[0]?.url;
  const price = Number(product.salePrice ?? product.price);

  return {
    title: product.name,
    description: product.shortDesc ?? product.description?.slice(0, 155) ?? product.name,
    openGraph: {
      title: product.name,
      description: product.shortDesc ?? product.description?.slice(0, 155) ?? "",
      images: image ? [{ url: image, alt: product.name }] : [],
    },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "EUR",
    },
  };
}

const TRUST_BADGES = [
  { icon: Truck, label: "Envío a domicilio", sub: "2 horas en Bogotá" },
  { icon: Shield, label: "Producto garantizado", sub: "100% original" },
  { icon: RotateCcw, label: "Devoluciones", sub: "Hasta 30 días" },
];

const EMOJI_MAP: Record<string, string> = {
  perfumeria: "🌸", skincare: "🧴", maquillaje: "💄",
  vitaminas: "🌿", medicamentos: "💊", bebes: "👶",
  "higiene-oral": "🦷", hogar: "🏠",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const emoji = EMOJI_MAP[product.category.slug] ?? "🛍️";
  const discount = product.salePrice ? calcDiscount(Number(product.price), Number(product.salePrice)) : null;
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/productos" className="hover:text-[#2D1B69]">Productos</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/productos?categoria=${product.category.slug}`} className="hover:text-[#2D1B69]">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="space-y-4">
          <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm h-80 flex items-center justify-center overflow-hidden">
            {discount && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1">
                -{discount}% OFF
              </Badge>
            )}
            {primaryImage ? (
              <ProductImage
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.name}
                emoji={emoji}
              />
            ) : (
              <span className="text-8xl">{emoji}</span>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2">
            {product.images.slice(0, 4).map((img, i) => (
              <div
                key={img.id}
                className={`h-16 w-16 rounded-xl border-2 flex items-center justify-center text-2xl cursor-pointer transition-all bg-white ${
                  i === 0 ? "border-[#2D1B69]" : "border-gray-100 hover:border-purple-200"
                }`}
              >
                <span>{emoji}</span>
              </div>
            ))}
            {product.images.length === 0 &&
              [0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-16 w-16 rounded-xl border-2 flex items-center justify-center text-2xl bg-purple-50 ${i === 0 ? "border-[#2D1B69]" : "border-gray-100"}`}>
                  {emoji}
                </div>
              ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">{product.brand}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1 leading-snug">{product.name}</h1>
            {product.sku && <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>}
          </div>

          {/* Rating */}
          {product.ratingCount > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={cn("h-5 w-5", s <= Math.round(product.ratingAvg) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.ratingAvg.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({product.ratingCount} reseñas)</span>
            </div>
          )}

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#2D1B69]">
              {formatPrice(Number(product.salePrice ?? product.price))}
            </span>
            {product.salePrice && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(Number(product.price))}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-orange-400" : "bg-red-500"}`} />
            <span className="text-sm text-gray-600">
              {product.stock > 10 ? `En stock (${product.stock} disponibles)` :
               product.stock > 0 ? `¡Solo ${product.stock} disponibles!` : "Agotado"}
            </span>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Selector de cantidad + CTA */}
          {product.stock > 0 && (
            <div className="space-y-3">
              <QuantitySelector productId={product.id} maxStock={product.stock} />
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex flex-col items-center text-center gap-1.5 bg-gray-50 rounded-xl p-3">
                  <Icon className="h-5 w-5 text-[#2D1B69]" />
                  <p className="text-xs font-medium text-gray-800 leading-tight">{badge.label}</p>
                  <p className="text-[10px] text-gray-500">{badge.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reseñas */}
      {product.reviews.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Reseñas de clientes ({product.ratingCount})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-[#2D1B69] shrink-0">
                    {review.user.firstName[0]}{review.user.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={cn("h-3.5 w-3.5", s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200")} />
                        ))}
                      </div>
                    </div>
                    {review.title && <p className="text-sm font-medium text-gray-700 mb-1">{review.title}</p>}
                    {review.body && <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Relacionados */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Productos relacionados</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {serializeProducts(related).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
