import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/categories
export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

// POST /api/admin/categories
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, icon, imageUrl, isActive, sortOrder } = body;

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: "Nombre y slug son obligatorios" }, { status: 400 });
  }

  try {
    const category = await prisma.category.create({
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
    return NextResponse.json(category, { status: 201 });
  } catch (e: unknown) {
    const msg = (e as { code?: string }).code === "P2002" ? "El slug ya existe" : "Error al crear categoría";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
