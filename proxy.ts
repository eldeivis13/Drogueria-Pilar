import { NextRequest, NextResponse } from "next/server";

// Rutas que requieren sesión activa
const PROTECTED = ["/carrito", "/checkout", "/cuenta", "/favoritos"];

// Rutas exclusivas para ADMIN
const ADMIN_ONLY = ["/admin"];

// Rutas que NO deben verse si ya estás autenticado
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // NextAuth v5 guarda la sesión en esta cookie
  const session =
    req.cookies.get("__Secure-authjs.session-token") ??
    req.cookies.get("authjs.session-token");

  const isLoggedIn = !!session;

  // Si ya está autenticado y va a login/register → home
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si no está autenticado y va a ruta protegida → login
  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin: redirigir a home si no está autenticado
  // (el layout de /admin verifica el rol ADMIN en el servidor)
  const isAdmin = ADMIN_ONLY.some((r) => pathname.startsWith(r));
  if (isAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
