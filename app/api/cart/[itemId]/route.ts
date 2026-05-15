import { NextRequest, NextResponse } from "next/server";
import { updateCartItem, removeFromCart } from "@/lib/data/cart";

// PATCH /api/cart/[itemId] — actualizar cantidad
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (typeof quantity !== "number") {
      return NextResponse.json({ error: "quantity debe ser un número" }, { status: 400 });
    }

    const result = await updateCartItem(itemId, quantity);
    return NextResponse.json(result ?? { deleted: true });
  } catch (error) {
    console.error("[PATCH /api/cart/[itemId]]", error);
    return NextResponse.json({ error: "Error al actualizar item" }, { status: 500 });
  }
}

// DELETE /api/cart/[itemId] — eliminar item
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    await removeFromCart(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/cart/[itemId]]", error);
    return NextResponse.json({ error: "Error al eliminar item" }, { status: 500 });
  }
}
