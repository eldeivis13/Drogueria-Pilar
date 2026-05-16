import Link from "next/link";
import { ArrowLeft, ShoppingBag, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F0EEF8] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">

        {/* Número 404 */}
        <div className="relative">
          <p className="text-[10rem] font-extrabold text-[#2D1B69]/10 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">💊</span>
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Ups! Página no encontrada
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            La página que buscas no existe o ha sido movida. No te preocupes,
            en nuestra tienda encontrarás todo lo que necesitas.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl h-11 px-6 font-semibold">
              <Home className="h-4 w-4 mr-2" /> Ir al inicio
            </Button>
          </Link>
          <Link href="/productos">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl h-11 px-6 border-gray-200 text-gray-700">
              <ShoppingBag className="h-4 w-4 mr-2" /> Ver productos
            </Button>
          </Link>
        </div>

        {/* Sugerencias rápidas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left space-y-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Search className="h-4 w-4 text-[#2D1B69]" /> Quizás buscabas...
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "💊 Medicamentos", href: "/productos?categoria=medicamentos" },
              { label: "🧴 Skincare",     href: "/productos?categoria=skincare"     },
              { label: "💄 Maquillaje",   href: "/productos?categoria=maquillaje"   },
              { label: "🌸 Perfumería",   href: "/productos?categoria=perfumeria"   },
              { label: "🌿 Vitaminas",    href: "/productos?categoria=vitaminas"    },
              { label: "🔥 Ofertas",      href: "/productos?oferta=true"            },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs bg-purple-50 hover:bg-purple-100 text-[#2D1B69] font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <Link href="javascript:history.back()" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#2D1B69] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver atrás
        </Link>

      </div>
    </div>
  );
}
