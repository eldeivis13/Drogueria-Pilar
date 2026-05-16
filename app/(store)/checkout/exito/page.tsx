"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Loader2,
  ArrowRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/format";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  shippingFirstName: string;
  shippingLastName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingDepartment: string;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productBrand: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

export default function CheckoutExitoPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrder(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Encabezado de éxito */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Pedido confirmado!</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Tu pago ha sido procesado correctamente. Recibirás tu pedido en breve.
          </p>
        </div>
        {order && (
          <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl">
            <Package className="h-4 w-4 text-[#2D1B69]" />
            <span className="text-sm font-semibold text-[#2D1B69]">{order.orderNumber}</span>
          </div>
        )}
      </div>

      {/* Detalle del pedido */}
      {order && !error && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#2D1B69]" /> Resumen del pedido
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                    {item.productBrand && (
                      <p className="text-xs text-gray-400">{item.productBrand}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                    <p className="text-sm font-semibold text-[#2D1B69]">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                {order.shippingCost === 0
                  ? <span className="text-green-600 font-medium">¡Gratis!</span>
                  : <span>{formatPrice(order.shippingCost)}</span>
                }
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total pagado</span>
              <span className="text-xl font-bold text-[#2D1B69]">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#2D1B69]" /> Dirección de entrega
            </h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-800">
                {order.shippingFirstName} {order.shippingLastName}
              </p>
              <p>{order.shippingStreet}</p>
              <p>{order.shippingCity}, {order.shippingDepartment}</p>
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 text-sm">
          No se pudo cargar el detalle del pedido, pero tu pago fue procesado correctamente.
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/cuenta/pedidos" className="flex-1">
          <Button className="w-full bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl h-11 font-semibold">
            Ver mis pedidos <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        <Link href="/productos" className="flex-1">
          <Button variant="outline" className="w-full rounded-xl h-11 border-gray-200 text-gray-700">
            Seguir comprando
          </Button>
        </Link>
      </div>

      <p className="text-xs text-center text-gray-400">
        ¿Preguntas sobre tu pedido? Escríbenos a{" "}
        <a href="mailto:info@drogueriapilar.es" className="text-[#2D1B69] hover:underline">
          info@drogueriapilar.es
        </a>
      </p>
    </div>
  );
}
