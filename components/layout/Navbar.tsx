"use client";

import { Heart, ShoppingCart, LogOut, User, Settings } from "lucide-react";
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

export function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();

  const initials = session?.user
    ? `${session.user.firstName?.[0] ?? ""}${session.user.lastName?.[0] ?? ""}`.toUpperCase()
    : "??";

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-purple-200/60 bg-[#F0EEF8]/95 backdrop-blur-sm px-4 md:px-6">
      <div className="grid grid-cols-3 items-center h-full max-w-screen-xl mx-auto">

        {/* IZQUIERDA — Logo + Nombre */}
        <div className="flex items-center">
          <div className="leading-none">
            <span className="text-[#2D1B69] font-bold text-base tracking-tight">Droguería</span>
            <span className="text-[#7C3AED] font-bold text-base tracking-tight"> Pilar</span>
          </div>
        </div>

        {/* CENTRO — Buscador */}
        <div className="flex justify-center">
          <SearchBar />
        </div>

        {/* DERECHA — Acciones */}
        <div className="flex items-center gap-2 justify-end">

          {/* Favoritos */}
          <Link href="/favoritos">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-red-500 hover:bg-red-50">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Carrito */}
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

          {/* Usuario */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-[#2D1B69] flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-sm">
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5 text-xs text-gray-500">
                  <p className="font-medium text-gray-800">
                    {session.user.firstName} {session.user.lastName}
                  </p>
                  <p className="truncate">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/cuenta" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Mi cuenta
                  </Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" /> Panel admin
                    </Link>
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
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-9 text-sm text-[#2D1B69] hover:bg-purple-50 rounded-xl">
                  Ingresar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-9 text-sm bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
