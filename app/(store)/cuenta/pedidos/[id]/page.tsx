"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight, Loader2, Package, Truck, CheckCircle2,
  Clock, X, MapPin, CreditCard, ArrowLeft, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/format";

interface OrderItem {
  id: string;
  productName: string;
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
  updatedAt: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  paymentMethod: string;
  notes: string | null;
  items: OrderItem[];
}

const STATUS_STEPS = [
  { key: "PENDING",    label: "Pedido recibido",  icon: Clock        },
  { key: "CONFIRMED",  label: "Confirmado",        icon: CheckCircle2 },
  { key: "PROCESSING", label: "En preparación",    icon: Package      },
  { key: "SHIPPED",    label: "Enviado",           icon: Truck        },
  { key: "DELIVERED",  label: "Entregado",         icon: CheckCircle2 },
];

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pendiente",      color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED:  { label: "Confirmado",     color: "bg-blue-100 text-blue-700"     },
  PROCESSING: { label: "En preparación", color: "bg-purple-100 text-purple-700" },
  SHIPPED:    { label: "Enviado",        color: "bg-indigo-100 text-indigo-700" },
  DELIVERED:  { label: "Entregado",      color: "bg-green-100 text-green-700"   },
  CANCELLED:  { label: "Cancelado",      color: "bg-red-100 text-red-700"       },
};

const PAYMENT_LABEL: Record<string, string> = {
  CREDIT_CARD:      "Tarjeta de crédito",
  DEBIT_CARD:       "Tarjeta débito",
  BANK_TRANSFER:    "Transferencia bancaria",
  CASH_ON_DELIVERY: "Pago contra entrega",
  PSE:              "PSE",
  STRIPE:           "Tarjeta (Stripe)",
};

export default function DetallePedidoPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data);
      })
      .catch(() => setError("Error al cargar el pedido"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ShoppingBag className="h-14 w-14 text-gray-200" />
        <p className="font-semibold text-gray-600">{error ?? "Pedido no encontrado"}</p>
        <Link href="/cuenta">
          <Button variant="outline" className="rounded-xl border-[#2D1B69] text-[#2D1B69]">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver a mi cuenta
          </Button>
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.PENDING;
  const isCancelled = order.status === "CANCELLED";
  const currentStep = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/cuenta" className="hover:text-[#2D1B69]">Mi cuenta</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/cuenta" className="hover:text-[#2D1B69]">Pedidos</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-800 font-mono font-medium">{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido {order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Realizado el {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={`${cfg.color} border-0 text-sm px-4 py-1.5 w-fit`}>{cfg.label}</Badge>
      </div>

      {/* Timeline de estado */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Estado del pedido</h2>
          <div className="flex items-start gap-0">
            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = i <= currentStep;
              const active = i === currentStep;
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    {/* Línea izquierda */}
                    {i > 0 && (
                      <div className={`flex-1 h-0.5 ${i <= currentStep ? "bg-[#2D1B69]" : "bg-gray-200"}`} />
                    )}
                    {/* Círculo */}
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      active
                        ? "bg-[#2D1B69] border-[#2D1B69] text-white ring-4 ring-purple-100"
                        : done
                        ? "bg-[#2D1B69] border-[#2D1B69] text-white"
                        : "bg-white border-gray-200 text-gray-300"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {/* Línea derecha */}
                    {!isLast && (
                      <div className={`flex-1 h-0.5 ${i < currentStep ? "bg-[#2D1B69]" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <p className={`text-xs mt-2 text-center leading-tight px-1 ${
                    done ? "text-[#2D1B69] font-semibold" : "text-gray-400"
                  }`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
          <X className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Este pedido fue cancelado.</p>
        </div>
      )}

      {/* Productos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Package className="h-4 w-4 text-[#2D1B69]" /> Productos ({order.items.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl shrink-0">
                🛍️
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatPrice(Number(item.unitPrice))} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-900 shrink-0">
                {formatPrice(Number(item.subtotal))}
              </p>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Envío</span>
            <span>{Number(order.shippingCost) === 0 ? "Gratis" : formatPrice(Number(order.shippingCost))}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span className="text-[#2D1B69] text-lg">{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Info inferior: envío + pago */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-[#2D1B69]" /> Dirección de entrega
          </h3>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p>{order.shippingAddress}</p>
            <p>{order.shippingCity}{order.shippingState ? `, ${order.shippingState}` : ""}</p>
            {order.shippingZip && <p>CP {order.shippingZip}</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-[#2D1B69]" /> Método de pago
          </h3>
          <p className="text-sm text-gray-600">
            {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
          </p>
          {order.notes && (
            <>
              <Separator />
              <p className="text-xs text-gray-500 italic">{order.notes}</p>
            </>
          )}
        </div>
      </div>

      {/* Volver */}
      <div className="pb-4">
        <Link href="/cuenta">
          <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 hover:border-[#2D1B69] hover:text-[#2D1B69]">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver a mis pedidos
          </Button>
        </Link>
      </div>

    </div>
  );
}
