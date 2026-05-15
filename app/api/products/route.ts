import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data/products";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const result = await getProducts({
      categorySlug: searchParams.get("categoria") ?? undefined,
      search: searchParams.get("q") ?? undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      onSale: searchParams.get("oferta") === "true",
      featured: searchParams.get("destacado") === "true",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
      sort: (searchParams.get("sort") as "price_asc" | "price_desc" | "rating" | "newest" | "popular") ?? "newest",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
