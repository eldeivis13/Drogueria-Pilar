"use client";

import { Bell, Heart, ShoppingCart, LogOut, User, Settings, Menu } from "lucide-react";
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

export function Navbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: session } = useSession();
  const { itemCount } = useCart();

  const initials = session?.user
    ? `${session.user.firstName?.[0] ?? ""}${session.user.lastName?.[0] ?? ""}`.toUpperCase()
    : "??";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-gray-200 bg-[#F0EEF8] px-4 md:px-6">
      {/* Botón hamburguesa — solo móvil */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:text-[#2D1B69] hover:bg-purple-50 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <SearchBar />

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Favoritos */}
        <Link href="/favoritos">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-red-500 hover:bg-red-50">
            <Heart className="h-5 w-5" />
          </Button>
        </Link>

        {/* Cart */}
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

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-500 hover:text-[#2D1B69] hover:bg-purple-50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User menu */}
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-400 to-[#2D1B69] flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
    </header>
  );
}
