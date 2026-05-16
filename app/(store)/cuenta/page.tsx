"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User, Package, Lock, ChevronRight, Loader2,
  CheckCircle2, AlertCircle, Pencil, X, Save,
  Clock, Truck, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/format";

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:    { label: "Pendiente",      color: "bg-yellow-100 text-yellow-700", icon: Clock },
  CONFIRMED:  { label: "Confirmado",     color: "bg-blue-100 text-blue-700",     icon: CheckCircle2 },
  PROCESSING: { label: "En preparación", color: "bg-purple-100 text-purple-700", icon: Package },
  SHIPPED:    { label: "Enviado",        color: "bg-indigo-100 text-indigo-700", icon: Truck },
  DELIVERED:  { label: "Entregado",      color: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  CANCELLED:  { label: "Cancelado",      color: "bg-red-100 text-red-700",       icon: X },
};

const PAYMENT_LABEL: Record<string, string> = {
  CREDIT_CARD: "Tarjeta de crédito", DEBIT_CARD: "Tarjeta débito",
  BANK_TRANSFER: "Transferencia",    CASH_ON_DELIVERY: "Contra entrega", PSE: "PSE",
};

// ─── types ──────────────────────────────────────────────────
interface UserProfile {
  id: string; firstName: string; lastName: string;
  email: string; phone: string | null; role: string;
  createdAt: string; _count: { orders: number };
}
interface OrderItem { id: string; productName: string; quantity: number; unitPrice: number; subtotal: number }
interface Order {
  id: string; orderNumber: string; status: string; total: number;
  createdAt: string; shippingCity: string; paymentMethod: string;
  items: OrderItem[];
}

type Tab = "perfil" | "pedidos" | "seguridad";

// ─── component ──────────────────────────────────────────────
export default function MiCuentaPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("perfil");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Expanded order
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cuenta")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone ?? "");
      })
      .finally(() => setLoadingProfile(false));

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoadingOrders(false));
  }, []);

  // ── save profile ──────────────────────────────────────────
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    const res = await fetch("/api/cuenta", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, phone }),
    });
    const data = await res.json();
    if (res.ok) {
      setProfile((p) => p ? { ...p, firstName: data.firstName, lastName: data.lastName, phone: data.phone } : p);
      setProfileMsg({ type: "ok", text: "Datos actualizados correctamente." });
      setEditing(false);
    } else {
      setProfileMsg({ type: "err", text: data.error ?? "Error al guardar." });
    }
    setSavingProfile(false);
  }

  function cancelEdit() {
    setFirstName(profile?.firstName ?? "");
    setLastName(profile?.lastName ?? "");
    setPhone(profile?.phone ?? "");
    setEditing(false);
    setProfileMsg(null);
  }

  // ── change password ───────────────────────────────────────
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ type: "err", text: "Las contraseñas nuevas no coinciden." });
      return;
    }
    setSavingPw(true);
    const res = await fetch("/api/cuenta/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwMsg({ type: "ok", text: "Contraseña actualizada correctamente." });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } else {
      setPwMsg({ type: "err", text: data.error ?? "Error al cambiar contraseña." });
    }
    setSavingPw(false);
  }

  // ── helpers ───────────────────────────────────────────────
  const initials = profile
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : "??";

  const inputCls = "rounded-xl border-gray-200 h-10 focus-visible:ring-[#7C3AED]";
  const labelCls = "text-sm text-gray-600 font-medium";

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "perfil",    label: "Datos personales", icon: User    },
    { id: "pedidos",   label: "Mis pedidos",       icon: Package },
    { id: "seguridad", label: "Seguridad",          icon: Lock    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800">Mi cuenta</span>
        </nav>
      </div>

      {/* Profile hero */}
      {loadingProfile ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-7 w-7 animate-spin text-[#2D1B69]" />
        </div>
      ) : profile && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-400 to-[#2D1B69] flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-xs text-gray-400">
                Miembro desde {formatDate(profile.createdAt)}
              </span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">
                {profile._count.orders} pedido{profile._count.orders !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          {profile.role === "ADMIN" && (
            <Badge className="bg-purple-100 text-purple-700 border-0 shrink-0">Administrador</Badge>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? "bg-white text-[#2D1B69] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Datos personales ─────────────────────────── */}
      {tab === "perfil" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-4 w-4 text-[#2D1B69]" /> Datos personales
            </h2>
            {!editing && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[#2D1B69] hover:bg-purple-50 rounded-xl"
                onClick={() => { setEditing(true); setProfileMsg(null); }}
              >
                <Pencil className="h-3.5 w-3.5" /> Editar
              </Button>
            )}
          </div>

          {profileMsg && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
              profileMsg.type === "ok"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {profileMsg.type === "ok"
                ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                : <AlertCircle className="h-4 w-4 shrink-0" />}
              {profileMsg.text}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={labelCls}>Nombre <span className="text-red-500">*</span></Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <Label className={labelCls}>Apellido <span className="text-red-500">*</span></Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputCls} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className={labelCls}>Correo electrónico</Label>
                <Input value={profile?.email ?? ""} readOnly className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                <p className="text-xs text-gray-400">El correo no puede modificarse.</p>
              </div>
              <div className="space-y-1.5">
                <Label className={labelCls}>Teléfono</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" className={inputCls} />
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={savingProfile} className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl gap-2 h-10">
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Guardar cambios
                </Button>
                <Button type="button" variant="outline" className="rounded-xl h-10" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-4">
              {[
                { label: "Nombre", value: `${profile?.firstName} ${profile?.lastName}` },
                { label: "Correo electrónico", value: profile?.email },
                { label: "Teléfono", value: profile?.phone || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</dt>
                  <dd className="text-sm text-gray-800 mt-0.5">{value}</dd>
                  <Separator className="mt-3" />
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {/* ── TAB: Mis pedidos ─────────────────────────────── */}
      {tab === "pedidos" && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-[#2D1B69]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <ShoppingBag className="h-14 w-14 text-gray-200" />
              <div className="text-center">
                <p className="font-semibold text-gray-700">Aún no tienes pedidos</p>
                <p className="text-sm text-gray-400 mt-1">Cuando hagas una compra aparecerá aquí</p>
              </div>
              <Link href="/productos">
                <Button className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
                  Explorar productos
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">{orders.length} pedido{orders.length !== 1 ? "s" : ""}</p>
              {orders.map((order) => {
                const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.PENDING;
                const StatusIcon = cfg.icon;
                const isOpen = expanded === order.id;

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-[#2D1B69]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 font-mono text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(order.createdAt)} · {order.shippingCity}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge className={`${cfg.color} border-0 text-xs flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </Badge>
                        <p className="font-bold text-[#2D1B69] text-sm min-w-[80px] text-right">
                          {formatPrice(Number(order.total))}
                        </p>
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-purple-50 flex items-center justify-center text-xs shrink-0">🛍️</div>
                                <span className="text-gray-700">{item.productName}</span>
                                <span className="text-gray-400 text-xs">×{item.quantity}</span>
                              </div>
                              <span className="font-semibold text-gray-800">{formatPrice(Number(item.subtotal))}</span>
                            </div>
                          ))}
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">{formatPrice(Number(order.total))}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ── TAB: Seguridad ───────────────────────────────── */}
      {tab === "seguridad" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#2D1B69]" /> Cambiar contraseña
          </h2>

          {pwMsg && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
              pwMsg.type === "ok"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {pwMsg.type === "ok"
                ? <CheckCircle2 className="h-4 w-4 shrink-0" />
                : <AlertCircle className="h-4 w-4 shrink-0" />}
              {pwMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label className={labelCls}>Contraseña actual</Label>
              <Input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                required
                autoComplete="current-password"
                className={inputCls}
              />
            </div>
            <Separator />
            <div className="space-y-1.5">
              <Label className={labelCls}>Nueva contraseña</Label>
              <Input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelCls}>Confirmar nueva contraseña</Label>
              <Input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                autoComplete="new-password"
                className={`${inputCls} ${
                  confirmPw && confirmPw !== newPw ? "border-red-300 focus-visible:ring-red-400" : ""
                }`}
              />
              {confirmPw && confirmPw !== newPw && (
                <p className="text-xs text-red-500">Las contraseñas no coinciden.</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={savingPw || (!!confirmPw && confirmPw !== newPw)}
              className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl gap-2 h-10"
            >
              {savingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Actualizar contraseña
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
