import { NextResponse } from "next/server";
import { getCategories } from "@/lib/data/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}
