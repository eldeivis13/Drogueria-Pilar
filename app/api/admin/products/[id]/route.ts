import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/products/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, tags: true },
    });
    if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[GET /api/admin/products/[id]]", error);
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 });
  }
}

// PUT /api/admin/products/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    const {
      name, description, shortDesc, sku, price, salePrice,
      stock, brand, categoryId, isFeatured, requiresPrescription, isActive,
    } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json({ error: "Nombre, descripción y precio son obligatorios" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        shortDesc,
        sku,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        stock: stock !== undefined ? Number(stock) : undefined,
        brand,
        categoryId,
        isFeatured: Boolean(isFeatured),
        requiresPrescription: Boolean(requiresPrescription),
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
      include: { category: true, images: true },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PUT /api/admin/products/[id]]", error);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — soft delete (isActive = false)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { id } = await params;
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/admin/products/[id]]", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
