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
}

// PUT /api/admin/products/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const {
    name, description, shortDesc, sku, price, salePrice,
    stock, brand, categoryId, isFeatured, requiresPrescription, isActive,
  } = body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      shortDesc,
      sku,
      price: price !== undefined ? Number(price) : undefined,
      salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      brand,
      categoryId,
      isFeatured,
      requiresPrescription,
      isActive,
    },
    include: { category: true, images: true },
  });
  return NextResponse.json(product);
}

// DELETE /api/admin/products/[id] — soft delete (isActive = false)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
