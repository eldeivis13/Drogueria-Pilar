import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

// PUT /api/admin/categories/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, icon, imageUrl, isActive, sortOrder } = body;

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: "Nombre y slug son obligatorios" }, { status: 400 });
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });
    return NextResponse.json(category);
  } catch (e: unknown) {
    const msg = (e as { code?: string }).code === "P2002" ? "El slug ya existe" : "Error al actualizar";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const cat = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });

  if (!cat) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  if (cat._count.products > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${cat._count.products} producto(s) asociado(s)` },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
