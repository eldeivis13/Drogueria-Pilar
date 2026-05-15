import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Rutas que requieren sesión activa
const PROTECTED = ["/carrito", "/checkout", "/cuenta", "/favoritos"];

// Rutas exclusivas para ADMIN
const ADMIN_ONLY = ["/admin"];

// Rutas que NO deben verse si ya estás autenticado
const AUTH_ROUTES = ["/login", "/register"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Si ya está autenticado y va a login/register → redirigir al home
  if (session && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si no está autenticado y va a una ruta protegida → redirigir a login
  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  if (!session && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si va a una ruta de admin y no es ADMIN → redirigir al home
  const isAdmin = ADMIN_ONLY.some((r) => pathname.startsWith(r));
  if (isAdmin && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
