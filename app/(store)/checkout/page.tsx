"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  CreditCard,
  MapPin,
  User,
  CheckCircle2,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { cart, loading: cartLoading, subtotal } = useCart();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [department, setDepartment] = useState("España");
  const [postalCode, setPostalCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.firstName ?? "");
      setLastName(session.user.lastName ?? "");
    }
  }, [session]);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  const hasItems = (cart?.items.length ?? 0) > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!hasItems) { setError("Tu carrito está vacío."); return; }
    if (!firstName || !lastName || !city || !street) {
      setError("Completa todos los campos obligatorios."); return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "CREDIT_CARD",
          shippingFirstName: firstName,
          shippingLastName: lastName,
          shippingStreet: street,
          shippingCity: city,
          shippingDepartment: department,
          shippingPhone: phone,
          shippingPostalCode: postalCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear el pedido");

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setSubmitting(false);
    }
  }

  if (sessionStatus === "loading" || cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-200" />
        <div>
          <p className="text-lg font-semibold text-gray-700">Tu carrito está vacío</p>
          <p className="text-sm text-gray-400 mt-1">Agrega productos antes de continuar</p>
        </div>
        <Link href="/productos">
          <Button className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
            Ver productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finalizar compra</h1>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Link href="/" className="hover:text-[#2D1B69]">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/carrito" className="hover:text-[#2D1B69]">Carrito</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800">Checkout</span>
        </nav>
      </div>

      {/* Pasos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-8 right-8 h-px bg-gray-200 -z-0" />
          {[
            { id: 1, label: "Datos", icon: User, done: true },
            { id: 2, label: "Envío", icon: MapPin, done: false, active: true },
            { id: 3, label: "Pago", icon: CreditCard, done: false },
            { id: 4, label: "Listo", icon: CheckCircle2, done: false },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.done ? "bg-[#2D1B69] text-white" : step.active ? "bg-white border-2 border-[#2D1B69] text-[#2D1B69]" : "bg-gray-100 text-gray-400"
                }`}>
                  {step.done ? <Icon className="h-4 w-4" /> : step.id}
                </div>
                <span className={`text-xs font-medium ${step.done || step.active ? "text-[#2D1B69]" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Datos personales */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-[#2D1B69]" /> Información personal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Nombre <span className="text-red-500">*</span></Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ej: María" required className="rounded-xl border-gray-200 h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Apellido <span className="text-red-500">*</span></Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ej: García" required className="rounded-xl border-gray-200 h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Correo</Label>
                <Input type="email" value={session?.user?.email ?? ""} readOnly className="rounded-xl border-gray-200 h-10 bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Teléfono</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" className="rounded-xl border-gray-200 h-10" />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-[#2D1B69]" /> Dirección de envío
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Ciudad <span className="text-red-500">*</span></Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ej: Madrid" required className="rounded-xl border-gray-200 h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Provincia</Label>
                  <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Ej: Madrid" className="rounded-xl border-gray-200 h-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Dirección <span className="text-red-500">*</span></Label>
                <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Ej: Calle Gran Vía 28, 3ºA" required className="rounded-xl border-gray-200 h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Código postal</Label>
                <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="28013" className="rounded-xl border-gray-200 h-10" />
              </div>
            </div>
          </div>

          {/* Info pago Stripe */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-[#2D1B69]" /> Pago seguro con Stripe
            </h3>
            <div className="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-3">
              <Lock className="h-5 w-5 text-[#2D1B69] shrink-0" />
              <p className="text-sm text-gray-600">
                Al confirmar serás redirigido a <strong>Stripe</strong>, la plataforma de pago seguro.
                Puedes pagar con tarjeta de crédito o débito. Tus datos están protegidos con cifrado SSL.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-400">Aceptamos:</span>
              {["💳 Visa", "💳 Mastercard", "💳 American Express"].map((card) => (
                <span key={card} className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{card}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 sticky top-20">
            <h3 className="font-bold text-gray-900">Tu pedido</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart?.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-lg shrink-0 overflow-hidden">
                    {item.product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : "🛍️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#2D1B69] shrink-0">
                    {formatPrice(Number(item.priceSnapshot) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                {shipping === 0
                  ? <span className="text-green-600 font-medium">¡Gratis!</span>
                  : <span>{formatPrice(shipping)}</span>
                }
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-[#2D1B69]">{formatPrice(total)}</span>
            </div>
            <Button
              type="submit"
              disabled={submitting || !hasItems}
              className="w-full bg-[#2D1B69] hover:bg-[#4A2D9C] text-white h-11 rounded-xl font-semibold disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirigiendo a Stripe...</>
              ) : (
                <><Lock className="h-4 w-4 mr-2" /> Pagar con Stripe</>
              )}
            </Button>
            <p className="text-xs text-center text-gray-400">🔒 Pago seguro · Sin guardar datos de tarjeta</p>
          </div>
        </div>
      </div>
    </form>
  );
}
