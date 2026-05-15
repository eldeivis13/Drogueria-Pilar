import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/[productId] — reseñas aprobadas de un producto
export async function GET(
  _req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: params.productId, isApproved: true },
      include: {
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[GET /api/reviews/[productId]]", error);
    return NextResponse.json({ error: "Error al obtener reseñas" }, { status: 500 });
  }
}

// POST /api/reviews/[productId] — crear reseña
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const userId = req.headers.get("x-user-id") ?? "demo-user-id";
    const body = await req.json();
    const { rating, title, body: reviewBody } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating debe ser entre 1 y 5" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId: params.productId,
        userId,
        rating,
        title,
        body: reviewBody,
        isApproved: false, // Requiere moderación
      },
    });

    // Recalcular rating del producto
    const agg = await prisma.review.aggregate({
      where: { productId: params.productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: params.productId },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reviews/[productId]]", error);
    return NextResponse.json({ error: "Error al crear reseña" }, { status: 500 });
  }
}
