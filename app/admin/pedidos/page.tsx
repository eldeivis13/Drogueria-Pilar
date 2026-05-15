"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, ShoppingBag, ChevronRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUSES = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "PROCESSING", label: "En preparación" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const NEXT_STATUS: Record<string, { value: string; label: string }> = {
  PENDING: { value: "CONFIRMED", label: "Confirmar" },
  CONFIRMED: { value: "PROCESSING", label: "En preparación" },
  PROCESSING: { value: "SHIPPED", label: "Marcar enviado" },
  SHIPPED: { value: "DELIVERED", label: "Marcar entregado" },
};

interface OrderItem { id: string; productName: string; quantity: number; unitPrice: number; subtotal: number }
interface Order {
  id: string; orderNumber: string; status: string; total: number; subtotal: number; shippingCost: number;
  createdAt: string; shippingFirstName: string; shippingLastName: string;
  shippingStreet: string; shippingCity: string; shippingPhone: string;
  paymentMethod: string;
  user: { firstName: string; lastName: string; email: string };
  items: OrderItem[];
}

const PAYMENT_LABEL: Record<string, string> = {
  CREDIT_CARD: "Tarjeta crédito", DEBIT_CARD: "Tarjeta débito",
  BANK_TRANSFER: "Transferencia", CASH_ON_DELIVERY: "Contra entrega", PSE: "PSE",
};

function PedidosContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("q", search);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await fetchOrders();
    setUpdating(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-sm text-gray-500">{total} pedidos en total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(q); }} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Número, email o cliente…" className="pl-9 rounded-xl border-gray-200 h-10 w-64" />
          </div>
          <Button type="submit" variant="outline" className="rounded-xl h-10">Buscar</Button>
        </form>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === s.value
                  ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-[#7C3AED]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShoppingBag className="h-12 w-12 text-gray-200" />
          <p className="text-gray-500 font-medium">No se encontraron pedidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            const next = NEXT_STATUS[order.status];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="flex-1 flex items-center gap-4 text-left min-w-0"
                  >
                    <ChevronRight className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 font-mono text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.user.firstName} {order.user.lastName} · {order.user.email}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-4 shrink-0">
                    <p className="text-xs text-gray-400 hidden lg:block">{formatDate(order.createdAt)}</p>
                    <Badge className={`${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"} border-0 text-xs`}>
                      {STATUSES.find((s) => s.value === order.status)?.label ?? order.status}
                    </Badge>
                    <p className="font-bold text-gray-800 text-sm min-w-[80px] text-right">
                      {formatPrice(Number(order.total))}
                    </p>
                    {next && (
                      <Button
                        size="sm"
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs h-8 px-3 gap-1 shrink-0"
                        onClick={() => updateStatus(order.id, next.value)}
                        disabled={updating === order.id}
                      >
                        {updating === order.id
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : next.label}
                      </Button>
                    )}
                    {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs h-8 px-3 shrink-0"
                        onClick={() => updateStatus(order.id, "CANCELLED")}
                        disabled={updating === order.id}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Dirección</p>
                        <p className="text-gray-700">{order.shippingStreet}</p>
                        <p className="text-gray-700">{order.shippingCity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Teléfono</p>
                        <p className="text-gray-700">{order.shippingPhone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Pago</p>
                        <p className="text-gray-700">{PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Envío</p>
                        <p className="text-gray-700">{Number(order.shippingCost) === 0 ? "Gratis" : formatPrice(Number(order.shippingCost))}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">{item.productName} <span className="text-gray-400">×{item.quantity}</span></span>
                          <span className="font-semibold text-gray-800">{formatPrice(Number(item.subtotal))}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(Number(order.total))}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminPedidosPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-[#7C3AED]" /></div>}>
      <PedidosContent />
    </Suspense>
  );
}
