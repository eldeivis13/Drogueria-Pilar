"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingCart, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCanceladoPage() {
  return (
    <div className="max-w-lg mx-auto space-y-6 py-4">
      {/* Encabezado */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pago cancelado</h1>
          <p className="text-gray-500 mt-2 text-sm">
            No se ha realizado ningún cargo. Tu carrito sigue disponible si quieres intentarlo de nuevo.
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">¿Qué ha pasado?</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[#2D1B69] font-bold mt-0.5">·</span>
            El proceso de pago fue interrumpido o cancelado antes de completarse.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2D1B69] font-bold mt-0.5">·</span>
            No se ha realizado ningún cargo en tu tarjeta.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2D1B69] font-bold mt-0.5">·</span>
            Tus productos siguen en el carrito — puedes retomar el pedido cuando quieras.
          </li>
        </ul>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/checkout" className="flex-1">
          <Button className="w-full bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl h-11 font-semibold">
            <ShoppingCart className="h-4 w-4 mr-2" /> Intentar de nuevo
          </Button>
        </Link>
        <Link href="/productos" className="flex-1">
          <Button variant="outline" className="w-full rounded-xl h-11 border-gray-200 text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" /> Seguir comprando
          </Button>
        </Link>
      </div>

      {/* Soporte */}
      <div className="bg-purple-50 rounded-2xl p-4 flex items-start gap-3">
        <HeadphonesIcon className="h-5 w-5 text-[#2D1B69] shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-800">¿Necesitas ayuda?</p>
          <p className="mt-0.5">
            Si tuviste algún problema con el pago, contáctanos en{" "}
            <a href="mailto:info@drogueriapilar.es" className="text-[#2D1B69] hover:underline font-medium">
              info@drogueriapilar.es
            </a>{" "}
            y te ayudamos.
          </p>
        </div>
      </div>
    </div>
  );
}
