"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, Tag, AlertTriangle, X, Save, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
}

const EMPTY: Omit<Category, "id" | "_count"> = {
  name: "", slug: "", description: "", icon: "", isActive: true, sortOrder: 0,
};

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "create" | "edit">(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setForm({ ...EMPTY });
    setEditing(null);
    setMsg(null);
    setModal("create");
  }

  function openEdit(cat: Category) {
    setForm({
      name: cat.name, slug: cat.slug,
      description: cat.description ?? "",
      icon: cat.icon ?? "",
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setEditing(cat);
    setMsg(null);
    setModal("edit");
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: modal === "create" ? slugify(name) : f.slug }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const url = modal === "edit" ? `/api/admin/categories/${editing!.id}` : "/api/admin/categories";
    const method = modal === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    });
    const data = await res.json();

    if (res.ok) {
      setMsg({ type: "ok", text: modal === "edit" ? "Categoría actualizada." : "Categoría creada." });
      await load();
      setTimeout(() => setModal(null), 900);
    } else {
      setMsg({ type: "err", text: data.error ?? "Error al guardar." });
    }
    setSaving(false);
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    setDeleting(cat.id);
    setDeleteErr(null);
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      await load();
    } else {
      setDeleteErr(data.error ?? "Error al eliminar.");
    }
    setDeleting(null);
  }

  const inputCls = "rounded-xl border-gray-200 h-10 focus-visible:ring-[#7C3AED]";
  const labelCls = "text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categorías en total</p>
        </div>
        <Button onClick={openCreate} className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Nueva categoría
        </Button>
      </div>

      {deleteErr && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {deleteErr}
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-[#2D1B69]" /></div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 bg-white rounded-2xl border border-gray-100">
          <Tag className="h-12 w-12 text-gray-200" />
          <p className="text-gray-500 font-medium">No hay categorías</p>
          <Button onClick={openCreate} variant="outline" className="rounded-xl border-[#2D1B69] text-[#2D1B69]">
            <Plus className="h-4 w-4 mr-1" /> Crear primera categoría
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Categoría</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Slug</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Productos</th>
                <th className="text-center px-4 py-3">Estado</th>
                <th className="text-center px-4 py-3">Orden</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl w-8 text-center">{cat.icon || "🏷️"}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{cat.name}</p>
                        {cat.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{cat.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{cat.slug}</code>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                    <Badge variant="secondary" className="bg-purple-50 text-[#2D1B69] border-0">
                      {cat._count.products}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {cat.isActive
                      ? <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium"><ToggleRight className="h-3 w-3"/>Activa</span>
                      : <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium"><ToggleLeft className="h-3 w-3"/>Inactiva</span>
                    }
                  </td>
                  <td className="px-4 py-3.5 text-center text-gray-500">{cat.sortOrder}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-[#2D1B69] hover:bg-purple-50 rounded-lg">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(cat)}
                        disabled={deleting === cat.id}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        {deleting === cat.id
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear / editar */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{modal === "create" ? "Nueva categoría" : "Editar categoría"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label className={labelCls}>Nombre <span className="text-red-500">*</span></Label>
                  <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} placeholder="Ej: Skincare" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className={labelCls}>Slug <span className="text-red-500">*</span></Label>
                  <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required className={inputCls} placeholder="ej: skincare" />
                  <p className="text-xs text-gray-400">Se usa en la URL: /productos?categoria=<strong>{form.slug || "..."}</strong></p>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Icono (emoji)</Label>
                  <Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className={inputCls} placeholder="🧴" maxLength={4} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Orden</Label>
                  <Input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className={inputCls} min={0} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className={labelCls}>Descripción</Label>
                  <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} placeholder="Descripción breve..." />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 accent-[#7C3AED] rounded" />
                  <Label htmlFor="isActive" className={labelCls}>Categoría activa (visible en la tienda)</Label>
                </div>
              </div>

              {msg && (
                <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${msg.type === "ok" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                  {msg.type === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {msg.text}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={saving} className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl gap-2 flex-1 h-10">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {modal === "create" ? "Crear categoría" : "Guardar cambios"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setModal(null)} className="rounded-xl h-10">Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
