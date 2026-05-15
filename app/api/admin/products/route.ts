import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/products — todos los productos con categoría
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { brand: { contains: q, mode: "insensitive" as const } },
          { sku: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

// POST /api/admin/products — crear producto
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name, description, shortDesc, sku, price, salePrice,
    stock, brand, categoryId, isFeatured, requiresPrescription,
    imageUrl,
  } = body;

  if (!name || !sku || !price || !categoryId) {
    return NextResponse.json(
      { error: "name, sku, price y categoryId son obligatorios" },
      { status: 400 }
    );
  }

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description ?? "",
      shortDesc: shortDesc ?? "",
      sku,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      stock: Number(stock ?? 0),
      brand: brand ?? null,
      categoryId,
      isFeatured: isFeatured ?? false,
      requiresPrescription: requiresPrescription ?? false,
      images: imageUrl
        ? { create: [{ url: imageUrl, altText: name, isPrimary: true, sortOrder: 0 }] }
        : undefined,
    },
    include: { category: true, images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
