"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/format";

interface OrderItem {
  id: string;
  productName: string;
  productBrand: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  createdAt: string;
  shippingCity: string;
  shippingStreet: string;
  paymentMethod: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  PROCESSING: { label: "En preparación", color: "bg-purple-100 text-purple-700", icon: Package },
  SHIPPED: { label: "En camino", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  DELIVERED: { label: "Entregado", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
};

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT_CARD: "Tarjeta de crédito",
  DEBIT_CARD: "Tarjeta débito",
  BANK_TRANSFER: "Transferencia bancaria",
  CASH_ON_DELIVERY: "Pago contra entrega",
  PSE: "PSE",
};

function PedidosContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const orderNumber = searchParams.get("order");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(orderNumber ?? null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800">Mis pedidos</span>
        </nav>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-sm">¡Pedido realizado con éxito!</p>
            {orderNumber && (
              <p className="text-xs text-green-700 mt-0.5">
                Número de orden: <span className="font-mono font-bold">{orderNumber}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShoppingBag className="h-14 w-14 text-gray-200" />
          <div>
            <p className="font-semibold text-gray-700">Aún no tienes pedidos</p>
            <p className="text-sm text-gray-400 mt-1">Cuando realices una compra, aparecerá aquí</p>
          </div>
          <Link href="/productos">
            <Button className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
              Explorar productos
            </Button>
          </Link>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
            const StatusIcon = statusCfg.icon;
            const isOpen = expanded === order.orderNumber;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Order header */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : order.orderNumber)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Package className="h-5 w-5 text-[#2D1B69]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm font-mono">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      className={`${statusCfg.color} border-0 font-medium text-xs flex items-center gap-1`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusCfg.label}
                    </Badge>
                    <p className="font-bold text-[#2D1B69] text-sm min-w-[90px] text-right">
                      {formatPrice(Number(order.total))}
                    </p>
                    <ChevronRight
                      className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </div>
                </button>

                {/* Order detail */}
                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                    {/* Items */}
                    <div className="space-y-3 pt-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-sm shrink-0">
                              🛍️
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                              {item.productBrand && (
                                <p className="text-xs text-gray-400">{item.productBrand}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">
                              {formatPrice(Number(item.subtotal))}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.quantity} × {formatPrice(Number(item.unitPrice))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Dirección de envío</p>
                        <p className="text-gray-700">
                          {order.shippingStreet}, {order.shippingCity}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Método de pago</p>
                        <p className="text-gray-700">
                          {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Subtotal</p>
                        <p className="text-gray-700">{formatPrice(Number(order.subtotal))}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Envío</p>
                        <p className="text-green-600 font-medium">
                          {Number(order.shippingCost) === 0 ? "Gratis" : formatPrice(Number(order.shippingCost))}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total pagado</span>
                      <span className="text-lg font-bold text-[#2D1B69]">
                        {formatPrice(Number(order.total))}
                      </span>
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

export default function PedidosPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" /></div>}>
      <PedidosContent />
    </Suspense>
  );
}
