"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  ChevronRight,
  LogOut,
  Store,
  Loader2,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/productos",   label: "Productos",   icon: Package         },
  { href: "/admin/categorias",  label: "Categorías",  icon: Tag             },
  { href: "/admin/pedidos",     label: "Pedidos",     icon: ShoppingBag     },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login"); return; }
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [status, session, router]);

  if (status === "loading" || !session || session?.user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  const initials = `${session.user.firstName?.[0] ?? ""}${session.user.lastName?.[0] ?? ""}`.toUpperCase() || "AD";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col bg-[#0F0A2A] text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="h-8 w-8 rounded-lg bg-[#7C3AED] flex items-center justify-center font-bold text-sm">P</div>
          <div>
            <p className="text-sm font-bold leading-none">Admin Panel</p>
            <p className="text-xs text-purple-300 mt-0.5">Droguería Pilar</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] uppercase font-semibold tracking-widest text-purple-400 px-3 mb-2">Gestión</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive ? "bg-[#7C3AED] text-white" : "text-purple-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-purple-300 hover:bg-white/10 hover:text-white transition-all">
            <Store className="h-4 w-4" /> Ver tienda
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-purple-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
          <div className="flex items-center gap-2 px-3 pt-2">
            <div className="h-7 w-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-xs font-bold shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{session.user.firstName} {session.user.lastName}</p>
              <p className="text-[10px] text-purple-400 truncate">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-200 bg-white flex items-center px-6 gap-2 text-sm text-gray-500 shrink-0">
          <Link href="/admin/dashboard" className="hover:text-[#7C3AED]">Admin</Link>
          {pathname !== "/admin/dashboard" && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-gray-800 capitalize">
                {pathname.split("/").filter(Boolean).slice(1).join(" / ")}
              </span>
            </>
          )}
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
