"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Trash2, Loader2, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n);
}

interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  images: { url: string }[];
}

export default function AdminProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("q", search);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Desactivar "${name}"? El producto no se eliminará, solo dejará de mostrarse.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await fetchProducts();
    setDeleting(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">{total} productos en total</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Nuevo producto
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => { e.preventDefault(); setSearch(q); }}
        className="flex gap-2"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, SKU o marca…"
            className="pl-9 rounded-xl border-gray-200 h-10"
          />
        </div>
        <Button type="submit" variant="outline" className="rounded-xl h-10">Buscar</Button>
        {search && (
          <Button type="button" variant="ghost" className="rounded-xl h-10" onClick={() => { setQ(""); setSearch(""); }}>
            Limpiar
          </Button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#7C3AED]" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <Package className="h-12 w-12 text-gray-200" />
            <p className="text-gray-500 font-medium">No se encontraron productos</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-4 w-4 text-purple-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[200px]">{p.name}</p>
                        {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category.name}</td>
                  <td className="px-4 py-3 text-right">
                    {p.salePrice ? (
                      <div>
                        <p className="font-semibold text-[#7C3AED]">{formatPrice(Number(p.salePrice))}</p>
                        <p className="text-xs text-gray-400 line-through">{formatPrice(Number(p.price))}</p>
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-800">{formatPrice(Number(p.price))}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${p.stock <= 5 ? "text-red-600" : p.stock <= 15 ? "text-amber-600" : "text-gray-800"}`}>
                      {p.stock}
                      {p.stock <= 5 && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`border-0 text-xs ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-[#7C3AED] hover:bg-purple-50"
                        onClick={() => router.push(`/admin/productos/${p.id}/editar`)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                      >
                        {deleting === p.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
