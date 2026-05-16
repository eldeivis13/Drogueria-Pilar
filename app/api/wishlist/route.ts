import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/wishlist — obtener favoritos del usuario
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            category: { select: { name: true, slug: true } },
            images: { where: { isPrimary: true }, take: 1 },
            tags: { select: { name: true } },
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[GET /api/wishlist]", error);
    return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 });
  }
}

// POST /api/wishlist — añadir a favoritos
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId requerido" }, { status: 400 });
    }

    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: session.user.id, productId } },
      update: {},
      create: { userId: session.user.id, productId },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/wishlist]", error);
    return NextResponse.json({ error: "Error al añadir favorito" }, { status: 500 });
  }
}

// DELETE /api/wishlist — eliminar de favoritos
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId requerido" }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id, productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/wishlist]", error);
    return NextResponse.json({ error: "Error al eliminar favorito" }, { status: 500 });
  }
}
