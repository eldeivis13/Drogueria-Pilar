import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/products/ProductCard";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { serializeProducts } from "@/lib/serializers";
import Link from "next/link";

const PRICE_RANGES = [
  { label: "Hasta $30.000", min: 0, max: 30000 },
  { label: "$30.000 – $80.000", min: 30000, max: 80000 },
  { label: "$80.000 – $150.000", min: 80000, max: 150000 },
  { label: "Más de $150.000", min: 150000, max: undefined },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Más reciente" },
  { value: "popular", label: "Más vendido" },
  { value: "rating", label: "Mejor calificado" },
  { value: "price_asc", label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
];

interface SearchParamsShape {
  categoria?: string;
  q?: string;
  oferta?: string;
  destacado?: string;
  sort?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface Props {
  searchParams: Promise<SearchParamsShape>;
}

export default async function ProductosPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const sort = (sp.sort ?? "newest") as "newest" | "popular" | "rating" | "price_asc" | "price_desc";

  const [{ items: products, total, totalPages }, categories] = await Promise.all([
    getProducts({
      categorySlug: sp.categoria,
      search: sp.q,
      onSale: sp.oferta === "true",
      featured: sp.destacado === "true",
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      sort,
      page,
      limit: 12,
    }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === sp.categoria);

  function buildUrl(params: Record<string, string | undefined>) {
    const current = {
      ...sp,
      ...params,
    };
    const qs = Object.entries(current)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return `/productos${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {activeCategory ? activeCategory.name : "Catálogo de Productos"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{total} productos encontrados</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filtros */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-5">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-[#2D1B69]" />
              <h3 className="font-semibold text-gray-900 text-sm">Filtros</h3>
            </div>

            {/* Categorías */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Categoría</p>
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/productos"
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg flex justify-between items-center transition-colors ${
                      !sp.categoria
                        ? "bg-[#2D1B69] text-white font-medium"
                        : "text-gray-600 hover:bg-purple-50 hover:text-[#2D1B69]"
                    }`}
                  >
                    <span>Todas</span>
                    <span className={!sp.categoria ? "text-purple-200" : "text-gray-400"}>
                      {total}
                    </span>
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={buildUrl({ categoria: cat.slug, page: "1" })}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-lg flex justify-between items-center transition-colors ${
                        sp.categoria === cat.slug
                          ? "bg-[#2D1B69] text-white font-medium"
                          : "text-gray-600 hover:bg-purple-50 hover:text-[#2D1B69]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </span>
                      <span className={sp.categoria === cat.slug ? "text-purple-200" : "text-gray-400"}>
                        {cat._count.products}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-4" />

            {/* Ofertas */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Filtros rápidos</p>
              <div className="space-y-1">
                <Link
                  href={buildUrl({ oferta: sp.oferta === "true" ? undefined : "true", page: "1" })}
                  className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    sp.oferta === "true"
                      ? "bg-red-50 text-red-600 font-medium"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  🔥 En oferta
                  {sp.oferta === "true" && (
                    <Badge className="ml-auto bg-red-100 text-red-600 border-0 text-xs">activo</Badge>
                  )}
                </Link>
                <Link
                  href={buildUrl({ destacado: sp.destacado === "true" ? undefined : "true", page: "1" })}
                  className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    sp.destacado === "true"
                      ? "bg-purple-50 text-[#2D1B69] font-medium"
                      : "text-gray-600 hover:bg-purple-50 hover:text-[#2D1B69]"
                  }`}
                >
                  ⭐ Destacados
                  {sp.destacado === "true" && (
                    <Badge className="ml-auto bg-purple-100 text-[#2D1B69] border-0 text-xs">activo</Badge>
                  )}
                </Link>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Precio */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Precio</p>
              <ul className="space-y-0.5">
                {PRICE_RANGES.map((range) => {
                  const isActive =
                    sp.minPrice === String(range.min) &&
                    (range.max === undefined || sp.maxPrice === String(range.max));
                  return (
                    <li key={range.label}>
                      <Link
                        href={buildUrl({
                          minPrice: String(range.min),
                          maxPrice: range.max !== undefined ? String(range.max) : undefined,
                          page: "1",
                        })}
                        className={`flex items-center text-sm px-2 py-1.5 rounded-lg transition-colors ${
                          isActive ? "bg-purple-50 text-[#2D1B69] font-medium" : "text-gray-600 hover:bg-purple-50"
                        }`}
                      >
                        {range.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Link href="/productos">
              <Button variant="outline" size="sm" className="w-full mt-4 border-[#2D1B69] text-[#2D1B69] hover:bg-purple-50 rounded-lg text-xs">
                Limpiar filtros
              </Button>
            </Link>
          </div>
        </aside>

        {/* Grid de productos */}
        <div className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              {sp.categoria && (
                <Badge variant="secondary" className="bg-purple-50 text-[#2D1B69] border-0 text-xs">
                  {activeCategory?.name} ✕
                </Badge>
              )}
              {sp.oferta === "true" && (
                <Badge variant="secondary" className="bg-red-50 text-red-600 border-0 text-xs">
                  En oferta ✕
                </Badge>
              )}
              {!sp.categoria && sp.oferta !== "true" && (
                <span className="text-xs text-gray-500">{total} resultados</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:block">Ordenar:</span>
              <div className="flex gap-1 flex-wrap">
                {SORT_OPTIONS.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ sort: opt.value, page: "1" })}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      sort === opt.value
                        ? "bg-[#2D1B69] text-white"
                        : "text-gray-600 hover:bg-purple-50 border border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {serializeProducts(products).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-gray-600 font-medium">No se encontraron productos</p>
              <p className="text-gray-400 text-sm mt-1">Intenta con otros filtros</p>
              <Link href="/productos" className="mt-4">
                <Button variant="outline" className="border-[#2D1B69] text-[#2D1B69] rounded-xl">
                  Ver todos los productos
                </Button>
              </Link>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={buildUrl({ page: String(p) })}>
                  <button
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[#2D1B69] text-white"
                        : "text-gray-600 hover:bg-purple-50 border border-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                </Link>
              ))}
              {page < totalPages && (
                <Link href={buildUrl({ page: String(page + 1) })}>
                  <button className="h-8 px-3 rounded-lg text-sm text-gray-600 hover:bg-purple-50 border border-gray-200 ml-1">
                    Siguiente →
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
