"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

const EMOJI_MAP: Record<string, string> = {
  perfumeria: "🌸", skincare: "🧴", maquillaje: "💄",
  vitaminas: "🌿", medicamentos: "💊", bebes: "👶",
  "higiene-oral": "🦷", hogar: "🏠",
};

export default function CarritoPage() {
  const { cart, loading, itemCount, subtotal, updateItem, removeItem } = useCart();

  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  if (loading && !cart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-7xl">🛒</div>
        <h2 className="text-xl font-bold text-gray-800">Tu carrito está vacío</h2>
        <p className="text-gray-500 text-sm">Agrega productos para comenzar tu compra</p>
        <Link href="/productos">
          <Button className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
            Explorar productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-[#2D1B69]" />
          Mi carrito
        </h1>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800">Carrito ({itemCount} items)</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => {
            const emoji = EMOJI_MAP["skincare"] ?? "🛍️";
            const primaryImg = item.product.images[0];
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start">
                <div className="h-20 w-20 rounded-xl bg-purple-50 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                  {primaryImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={primaryImg.url} alt={item.product.name} className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <span>{emoji}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-500 font-medium">{item.product.brand}</p>
                  <Link href={`/productos/${item.product.slug}`}>
                    <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#2D1B69] transition-colors mt-0.5">
                      {item.product.name}
                    </p>
                  </Link>
                  <p className="text-base font-bold text-[#2D1B69] mt-2">
                    {formatPrice(Number(item.priceSnapshot))}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="h-8 w-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Total: {formatPrice(Number(item.priceSnapshot) * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}

          <Link href="/productos">
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-[#2D1B69] rounded-xl w-full h-10 text-sm">
              ← Seguir comprando
            </Button>
          </Link>
        </div>

        {/* Resumen */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#2D1B69]" />
              Cupón de descuento
            </h3>
            <div className="flex gap-2">
              <Input placeholder="Ej: PILAR10" className="h-9 text-sm rounded-xl border-gray-200 focus-visible:ring-[#7C3AED]" />
              <Button size="sm" variant="outline" className="border-[#2D1B69] text-[#2D1B69] hover:bg-purple-50 rounded-xl h-9 shrink-0">
                Aplicar
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-900">Resumen del pedido</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "¡Gratis!" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400 bg-purple-50 rounded-lg p-2">
                  Agrega {formatPrice(50 - subtotal)} más para envío gratis 🚚
                </p>
              )}
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-[#2D1B69]">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full bg-[#2D1B69] hover:bg-[#4A2D9C] text-white h-11 rounded-xl font-semibold gap-2">
                Proceder al pago <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-center text-gray-400">🔒 Pago seguro — SSL certificado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
