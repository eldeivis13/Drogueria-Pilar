"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Heart,
  ShoppingCart,
  User,
  Package,
  Star,
  Settings,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/productos", label: "Catálogo", icon: ShoppingBag },
  { href: "/productos?filter=oferta", label: "Ofertas", icon: Tag },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/carrito", label: "Carrito", icon: ShoppingCart },
  { href: "/cuenta/pedidos", label: "Mis Pedidos", icon: Package },
  { href: "/cuenta", label: "Mi Cuenta", icon: User },
];

const adminItems = [
  { href: "/admin/dashboard", label: "Admin Panel", icon: Star },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";
  const firstName = session?.user?.firstName ?? "";
  const lastName = session?.user?.lastName ?? "";
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "Invitado";
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "??";

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gradient-to-b from-[#1A0A4A] to-[#2D1B69] text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute bottom-20 left-[-60px] w-48 h-48 rounded-full bg-[#4A2D9C] opacity-30" />
      <div className="absolute bottom-[-20px] left-[-20px] w-36 h-36 rounded-full bg-[#7C3AED] opacity-20" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white font-bold text-lg">
          P
        </div>
        <div>
          <p className="font-semibold text-sm leading-none">Droguería</p>
          <p className="text-purple-200 text-xs mt-0.5">Pilar</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 relative z-10">
        <p className="text-purple-300 text-xs font-medium uppercase tracking-wider px-3 mb-2">
          Principal
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white text-[#2D1B69] shadow-md"
                      : "text-purple-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {isAdmin && (
          <>
            <p className="text-purple-300 text-xs font-medium uppercase tracking-wider px-3 mb-2 mt-6">
              Administración
            </p>
            <ul className="space-y-0.5">
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-white text-[#2D1B69] shadow-md"
                          : "text-purple-100 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* User info at bottom */}
      <div className="relative z-10 p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-[#2D1B69] flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{fullName}</p>
            <p className="text-xs text-purple-300 truncate">
              {isAdmin ? "Administrador" : "Cliente"}
            </p>
          </div>
          <ChevronLeft className="h-4 w-4 text-purple-300 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
