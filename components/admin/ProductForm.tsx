"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, AlertCircle, Save, Upload, X, ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface Category { id: string; name: string; slug: string }

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Imagen
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

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

  async function uploadFile(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir");
      setImageUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Imagen del producto</h2>

        {/* Drop zone */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
            ${dragOver ? "border-[#7C3AED] bg-purple-50" : "border-gray-200 hover:border-[#7C3AED] hover:bg-purple-50/40"}
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {imageUrl ? (
            <div className="flex items-center gap-4 p-4">
              <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                <Image
                  src={imageUrl}
                  alt="Imagen del producto"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{imageUrl.split("/").pop()}</p>
                <p className="text-xs text-gray-400 mt-0.5">Haz clic o arrastra para cambiar la imagen</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setImageUrl(""); }}
                className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
                  <p className="text-sm text-[#7C3AED] font-medium">Subiendo imagen…</p>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-[#7C3AED]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Arrastra una imagen o <span className="text-[#7C3AED]">haz clic para seleccionar</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Máx. 5 MB · Se optimiza automáticamente</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {uploadError && (
          <p className="flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" /> {uploadError}
          </p>
        )}

        {/* URL manual como fallback */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-400">O introduce una URL directamente</Label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="rounded-xl border-gray-200 h-9 text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={saving || uploading}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl gap-2 h-10"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl h-10"
          onClick={() => router.push("/admin/productos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
