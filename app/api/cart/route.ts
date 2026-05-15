import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart, addToCart } from "@/lib/data/cart";
import { auth } from "@/auth";

// GET /api/cart — obtener carrito del usuario
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const cart = await getOrCreateCart(session.user.id);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("[GET /api/cart]", error);
    return NextResponse.json({ error: "Error al obtener carrito" }, { status: 500 });
  }
}

// POST /api/cart — agregar producto al carrito
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await req.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId es requerido" }, { status: 400 });
    }
    if (quantity < 1) {
      return NextResponse.json({ error: "La cantidad debe ser al menos 1" }, { status: 400 });
    }

    const item = await addToCart(userId, productId, quantity);
    return NextResponse.json(item, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al agregar al carrito";
    console.error("[POST /api/cart]", error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
