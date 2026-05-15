import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const related = await getRelatedProducts(product.categoryId, product.id);

    return NextResponse.json({ product, related });
  } catch (error) {
    console.error("[GET /api/products/[slug]]", error);
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 });
  }
}
