"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, ShoppingCart, LogOut, User, Settings, Menu, X, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { usePathname } from "next/navigation";

const mobileLinks = [
  { href: "/",          label: "Inicio",     icon: Home        },
  { href: "/productos", label: "Productos",  icon: ShoppingBag },
  { href: "/favoritos", label: "Favoritos",  icon: Heart       },
  { href: "/carrito",   label: "Carrito",    icon: ShoppingCart },
  { href: "/cuenta",    label: "Mi cuenta",  icon: User        },
];

export function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = session?.user
    ? `${session.user.firstName?.[0] ?? ""}${session.user.lastName?.[0] ?? ""}`.toUpperCase()
    : "??";

  // Cerrar menú al cambiar de ruta
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-purple-200/60 bg-[#F0EEF8]/95 backdrop-blur-sm">

      {/* ── Barra principal ── */}
      <div className="h-16 px-4 md:px-6">

        {/* DESKTOP — grid de 3 columnas */}
        <div className="hidden md:grid grid-cols-3 items-center h-full max-w-screen-xl mx-auto">

          {/* Izquierda: nombre */}
          <div className="flex items-center">
            <Link href="/" className="leading-none">
              <span className="text-[#2D1B69] font-bold text-base tracking-tight">Droguería</span>
              <span className="text-[#7C3AED] font-bold text-base tracking-tight"> Pilar</span>
            </Link>
          </div>

          {/* Centro: buscador */}
          <div className="flex justify-center">
            <SearchBar />
          </div>

          {/* Derecha: acciones */}
          <div className="flex items-center gap-2 justify-end">
            <Link href="/favoritos">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-red-500 hover:bg-red-50">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-500 hover:text-[#2D1B69] hover:bg-purple-50">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-[#7C3AED] text-white border-0">
                    {itemCount > 9 ? "9+" : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <UserMenu session={session} initials={initials} />
          </div>
        </div>

        {/* MÓVIL — fila compacta */}
        <div className="flex md:hidden items-center h-full gap-2">
          {/* Hamburguesa */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#2D1B69] hover:bg-purple-50 transition-colors shrink-0"
            aria-label="Menú"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Nombre centrado */}
          <Link href="/" className="flex-1 text-center leading-none">
            <span className="text-[#2D1B69] font-bold text-sm tracking-tight">Droguería</span>
            <span className="text-[#7C3AED] font-bold text-sm tracking-tight"> Pilar</span>
          </Link>

          {/* Carrito + usuario */}
          <div className="flex items-center gap-1 shrink-0">
            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-500 hover:text-[#2D1B69] hover:bg-purple-50">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-[#7C3AED] text-white border-0">
                    {itemCount > 9 ? "9+" : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <UserMenu session={session} initials={initials} />
          </div>
        </div>
      </div>

      {/* ── Drawer móvil ── */}
      {menuOpen && (
        <div ref={menuRef} className="md:hidden border-t border-purple-100 bg-[#F0EEF8] px-4 pb-4 pt-3 space-y-3 shadow-lg">
          {/* Buscador */}
          <SearchBar />

          {/* Links de navegación */}
          <nav className="space-y-0.5">
            {mobileLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-[#2D1B69] text-white"
                    : "text-gray-700 hover:bg-purple-100 hover:text-[#2D1B69]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-[#2D1B69] transition-colors"
              >
                <Settings className="h-4 w-4 shrink-0" />
                Panel admin
              </Link>
            )}
          </nav>

          {/* Cerrar sesión en móvil */}
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          )}
          {!session && (
            <div className="flex gap-2 pt-1">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl border-[#2D1B69] text-[#2D1B69]">Ingresar</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full rounded-xl bg-[#2D1B69] text-white">Registrarse</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

/* ── Componente reutilizable de menú de usuario ── */
function UserMenu({ session, initials }: { session: ReturnType<typeof useSession>["data"]; initials: string }) {
  if (!session) {
    return (
      <div className="hidden md:flex gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="h-9 text-sm text-[#2D1B69] hover:bg-purple-50 rounded-xl">Ingresar</Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="h-9 text-sm bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">Registrarse</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-[#2D1B69] flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-sm">
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5 text-xs text-gray-500">
          <p className="font-medium text-gray-800">{session.user.firstName} {session.user.lastName}</p>
          <p className="truncate">{session.user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/cuenta" className="cursor-pointer"><User className="h-4 w-4 mr-2" /> Mi cuenta</Link>
        </DropdownMenuItem>
        {session.user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="cursor-pointer"><Settings className="h-4 w-4 mr-2" /> Panel admin</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 cursor-pointer focus:text-red-500"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
