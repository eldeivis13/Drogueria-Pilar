"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Users, Package, TrendingUp,
  Clock, AlertTriangle, ChevronRight, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente", CONFIRMED: "Confirmado", PROCESSING: "En preparación",
  SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado",
};

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: {
    id: string; orderNumber: string; total: number; status: string; createdAt: string;
    user: { firstName: string; lastName: string; email: string };
  }[];
  ordersByStatus: { status: string; _count: { status: number } }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  if (!stats) return null;

  const kpis = [
    { label: "Ingresos totales", value: formatPrice(Number(stats.totalRevenue)), icon: TrendingUp, color: "bg-purple-50 text-purple-700", sub: "pedidos completados" },
    { label: "Total pedidos", value: stats.totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-700", sub: `${stats.pendingOrders} pendientes` },
    { label: "Productos activos", value: stats.totalProducts, icon: Package, color: "bg-green-50 text-green-700", sub: `${stats.lowStockProducts} con stock bajo` },
    { label: "Clientes", value: stats.totalUsers, icon: Users, color: "bg-amber-50 text-amber-700", sub: "registrados" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general de Droguería Pilar</p>
      </div>

      {/* Alerts */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.pendingOrders > 0 && (
            <Link href="/admin/pedidos?status=PENDING" className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-2.5 text-sm hover:bg-yellow-100 transition-colors">
              <Clock className="h-4 w-4" />
              <span><strong>{stats.pendingOrders}</strong> pedido{stats.pendingOrders > 1 ? "s" : ""} pendiente{stats.pendingOrders > 1 ? "s" : ""} de confirmar</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          {stats.lowStockProducts > 0 && (
            <Link href="/admin/productos?lowStock=1" className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-2.5 text-sm hover:bg-red-100 transition-colors">
              <AlertTriangle className="h-4 w-4" />
              <span><strong>{stats.lowStockProducts}</strong> producto{stats.lowStockProducts > 1 ? "s" : ""} con stock bajo</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{k.label}</p>
                <div className={`h-9 w-9 rounded-xl ${k.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{k.value}</p>
              <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Pedidos recientes</h2>
            <Link href="/admin/pedidos" className="text-sm text-[#7C3AED] hover:underline flex items-center gap-1">
              Ver todos <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 font-mono">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">
                      {order.user.firstName} {order.user.lastName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"} border-0 text-xs`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </Badge>
                  <p className="text-sm font-bold text-gray-800 min-w-[70px] text-right">
                    {formatPrice(Number(order.total))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Estado de pedidos</h2>
          <div className="space-y-3">
            {stats.ordersByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`${STATUS_COLOR[s.status] ?? "bg-gray-100 text-gray-600"} border-0 text-xs`}>
                    {STATUS_LABEL[s.status] ?? s.status}
                  </Badge>
                </div>
                <span className="text-sm font-bold text-gray-800">{s._count.status}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <Link href="/admin/productos/nuevo" className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl py-2 text-sm font-medium transition-colors">
              + Nuevo producto
            </Link>
            <Link href="/admin/pedidos" className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-2 text-sm font-medium transition-colors">
              Gestionar pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
