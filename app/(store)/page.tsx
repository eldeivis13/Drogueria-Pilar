import Link from "next/link";
import { ArrowRight, TrendingUp, ShoppingBag, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategories } from "@/lib/data/categories";
import { getFeaturedProducts, getSaleProducts } from "@/lib/data/products";
import { serializeProducts } from "@/lib/serializers";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [productCount, categoryCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
  ]);
  return { productCount, categoryCount };
}

export default async function HomePage() {
  const [categories, featured, sales, stats] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getSaleProducts(4),
    getStats(),
  ]);

  const statCards = [
    { label: "Productos", value: String(stats.productCount), icon: ShoppingBag, change: "en catálogo", color: "bg-purple-50 text-[#2D1B69]" },
    { label: "Categorías", value: String(stats.categoryCount), icon: TrendingUp, change: "disponibles", color: "bg-green-50 text-green-700" },
    { label: "Calificación", value: "4.8★", icon: Star, change: "promedio", color: "bg-amber-50 text-amber-700" },
    { label: "Envío gratis", value: "> 50 €", icon: Truck, change: "en pedidos", color: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A0A4A] via-[#2D1B69] to-[#4A2D9C] p-8 text-white">
        <div className="relative z-10 max-w-lg">
          <Badge className="mb-3 bg-white/20 text-white border-0 hover:bg-white/20">
            ✨ Colección primavera 2026
          </Badge>
          <h1 className="text-3xl font-bold leading-tight mb-3">
            Tu bienestar y belleza,<br />
            <span className="text-purple-200">en un solo lugar</span>
          </h1>
          <p className="text-purple-200 text-sm mb-6 leading-relaxed">
            Medicamentos, skincare, perfumería y mucho más. Envío a domicilio en Bogotá en 2 horas.
          </p>
          <div className="flex gap-3">
            <Link href="/productos">
              <Button className="bg-white text-[#2D1B69] hover:bg-purple-50 font-semibold rounded-xl h-10">
                Ver catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/productos?oferta=true">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-xl h-10">
                Ver ofertas
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-30 select-none">
          💊🌸🧴
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-20 translate-y-20" />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xs text-gray-400">{s.change}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Categorías</h2>
            <Link href="/productos" className="text-sm text-[#7C3AED] hover:text-[#2D1B69] font-medium flex items-center gap-1">
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl bg-white border border-gray-100 p-3 text-center hover:border-purple-200 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-[#2D1B69] leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-400">{cat._count.products}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos destacados */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Productos Destacados</h2>
              <p className="text-sm text-gray-500">Los más queridos por nuestros clientes</p>
            </div>
            <Link href="/productos?destacado=true" className="text-sm text-[#7C3AED] hover:text-[#2D1B69] font-medium flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {serializeProducts(featured).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Ofertas */}
      {sales.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">🔥 Ofertas del día</h2>
              <p className="text-sm text-gray-500">Precios especiales por tiempo limitado</p>
            </div>
            <Link href="/productos?oferta=true" className="text-sm text-[#7C3AED] hover:text-[#2D1B69] font-medium flex items-center gap-1">
              Ver ofertas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {serializeProducts(sales).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
