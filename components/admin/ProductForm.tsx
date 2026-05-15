"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Category { id: string; name: string; slug: string }

interface ProductFormProps {
  productId?: string; // si se pasa → modo edición
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.categories ?? []));
  }, []);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((p) => {
        setName(p.name ?? "");
        setSku(p.sku ?? "");
        setBrand(p.brand ?? "");
        setDescription(p.description ?? "");
        setShortDesc(p.shortDesc ?? "");
        setPrice(String(p.price ?? ""));
        setSalePrice(p.salePrice != null ? String(p.salePrice) : "");
        setStock(String(p.stock ?? "0"));
        setCategoryId(p.categoryId ?? "");
        setIsFeatured(p.isFeatured ?? false);
        setRequiresPrescription(p.requiresPrescription ?? false);
        setIsActive(p.isActive ?? true);
        setImageUrl(p.images?.[0]?.url ?? "");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = {
      name, sku, brand, description, shortDesc,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      stock: Number(stock),
      categoryId, isFeatured, requiresPrescription, isActive,
      imageUrl: imageUrl || undefined,
    };

    const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al guardar el producto");
      setSaving(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  const inputCls = "rounded-xl border-gray-200 h-10 focus-visible:ring-[#7C3AED]";
  const labelCls = "text-sm text-gray-600 font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Información básica */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Información básica</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label className={labelCls}>Nombre <span className="text-red-500">*</span></Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ej: Crema Hidratante Neutrogena" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className={labelCls}>SKU <span className="text-red-500">*</span></Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} required placeholder="Ej: NEU-HB-001" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className={labelCls}>Marca</Label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ej: Neutrogena" className={inputCls} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className={labelCls}>Descripción corta</Label>
            <Input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Frase resumen del producto" className={inputCls} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className={labelCls}>Descripción completa</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Descripción detallada del producto…"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Precio y stock */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Precio y stock</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className={labelCls}>Precio (€) <span className="text-red-500">*</span></Label>
            <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className={labelCls}>Precio oferta (€)</Label>
            <Input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="0.00" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className={labelCls}>Stock <span className="text-red-500">*</span></Label>
            <Input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="0" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Categoría y opciones */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Categoría y opciones</h2>
        <div className="space-y-1.5">
          <Label className={labelCls}>Categoría <span className="text-red-500">*</span></Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 h-10 px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] bg-white"
          >
            <option value="">Selecciona una categoría…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-6">
          {[
            { label: "Producto destacado", value: isFeatured, setter: setIsFeatured },
            { label: "Requiere receta", value: requiresPrescription, setter: setRequiresPrescription },
            { label: "Producto activo", value: isActive, setter: setIsActive },
          ].map(({ label, value, setter }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setter(e.target.checked)}
                className="h-4 w-4 rounded accent-[#7C3AED]"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Imagen */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Imagen</h2>
        <div className="space-y-1.5">
          <Label className={labelCls}>URL de imagen</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/images/products/nombre-producto.jpg" className={inputCls} />
        </div>
        {imageUrl && (
          <div className="h-24 w-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl gap-2 h-10">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" className="rounded-xl h-10" onClick={() => router.push("/admin/productos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
