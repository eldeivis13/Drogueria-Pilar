export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Clock, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategories } from "@/lib/data/categories";
import { getFeaturedProducts, getSaleProducts } from "@/lib/data/products";
import { serializeProducts } from "@/lib/serializers";

export default async function HomePage() {
  const [categories, featured, sales] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getSaleProducts(4),
  ]);

  return (
    <div className="space-y-8">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A0A4A] via-[#2D1B69] to-[#5B21B6] min-h-[260px] flex items-center">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-32 -translate-y-20 pointer-events-none" />
        <div className="absolute bottom-0 right-24 w-48 h-48 rounded-full bg-purple-400/10 translate-y-16 pointer-events-none" />
        <div className="absolute top-6 right-6 text-6xl md:text-8xl opacity-20 select-none pointer-events-none leading-none">
          🌸💊🧴<br/>💄🌿🦷
        </div>
        <div className="relative z-10 p-8 md:p-10 max-w-xl">
          <Badge className="mb-4 bg-white/20 text-white border-0 text-xs font-semibold tracking-wide">
            ✨ Primavera 2026
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            Tu bienestar y belleza,<br />
            <span className="text-purple-300">en un solo lugar</span>
          </h1>
          <p className="text-purple-200 text-sm md:text-base mb-7 leading-relaxed max-w-sm">
            Medicamentos, skincare, perfumería y más. Envío a domicilio rápido y seguro.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/productos">
              <Button className="bg-white text-[#2D1B69] hover:bg-purple-50 font-bold rounded-xl h-11 px-6 shadow-lg">
                Ver catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner de confianza */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { Icon: Truck,       label: "Envío a domicilio",      sub: "Rápido y seguro",    color: "text-[#2D1B69] bg-purple-50" },
          { Icon: ShieldCheck, label: "Productos garantizados", sub: "100% originales",    color: "text-green-700 bg-green-50"  },
          { Icon: RotateCcw,   label: "Devoluciones fáciles",   sub: "Hasta 30 días",      color: "text-amber-700 bg-amber-50"  },
          { Icon: Clock,       label: "Atención al cliente",    sub: "Lun–Sáb 9h a 20h",  color: "text-blue-700 bg-blue-50"    },
        ].map(({ Icon, label, sub, color }) => (
          <div key={label} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Comprar por categoría</h2>
            <Link href="/productos" className="text-sm text-[#7C3AED] hover:text-[#2D1B69] font-medium flex items-center gap-1">
              Ver todo <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 p-3 md:p-4 text-center hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#2D1B69] leading-tight">{cat.name}</span>
                <span className="text-[10px] text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">{cat._count.products}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Banner envío gratis */}
      <section className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🚚</span>
          <div className="text-white">
            <p className="font-bold text-lg">¡Envío GRATIS en pedidos +50 €!</p>
            <p className="text-green-100 text-sm">Entrega rápida a toda España</p>
          </div>
        </div>
        <Link href="/productos">
          <Button className="bg-white text-green-700 hover:bg-green-50 font-bold rounded-xl h-10 px-6 shrink-0">
            Aprovechar oferta
          </Button>
        </Link>
      </section>

      {/* Productos destacados */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">⭐ Productos Destacados</h2>
              <p className="text-sm text-gray-500">Los más queridos por nuestros clientes</p>
            </div>
            <Link href="/productos?destacado=true" className="text-sm text-[#7C3AED] hover:text-[#2D1B69] font-medium flex items-center gap-1">
              Ver todos <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {serializeProducts(featured).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Ofertas del día */}
      {sales.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">🔥 Ofertas del día</h2>
              <p className="text-sm text-gray-500">Precios especiales por tiempo limitado</p>
            </div>
            <Link href="/productos?oferta=true" className="text-sm text-[#7C3AED] hover:text-[#2D1B69] font-medium flex items-center gap-1">
              Ver ofertas <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {serializeProducts(sales).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Por qué elegirnos */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">¿Por qué elegir Droguería Pilar?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: "🏆", title: "Calidad garantizada",    desc: "Todos nuestros productos son originales, verificados directamente con los fabricantes." },
            { emoji: "💬", title: "Atención personalizada", desc: "Nuestro equipo de expertos te asesora para encontrar el producto perfecto para ti." },
            { emoji: "🔒", title: "Compra segura",          desc: "Pagos cifrados con SSL y procesados por Stripe, la plataforma más segura del mundo." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="text-center space-y-3">
              <span className="text-4xl">{emoji}</span>
              <h3 className="font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="rounded-2xl bg-gradient-to-r from-[#2D1B69] to-[#7C3AED] p-8 text-center text-white">
        <div className="flex justify-center mb-3">
          {[1,2,3,4,5].map((s) => <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
        </div>
        <h2 className="text-2xl font-bold mb-2">Más de 500 clientes satisfechos</h2>
        <p className="text-purple-200 text-sm mb-6 max-w-md mx-auto">
          Únete a nuestra comunidad y descubre la mejor selección de productos de salud y belleza.
        </p>
        <Link href="/productos">
          <Button className="bg-white text-[#2D1B69] hover:bg-purple-50 font-bold rounded-xl h-11 px-8 shadow-lg">
            Explorar catálogo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

    </div>
  );
}
