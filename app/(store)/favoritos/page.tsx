"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import type { ProductCardData } from "@/components/products/ProductCard";

interface WishlistItem {
  product: ProductCardData;
}

export default function FavoritosPage() {
  const { status } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { setLoading(false); return; }
    if (status !== "authenticated") return;

    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, [status]);

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <Heart className="h-16 w-16 text-gray-200" />
        <div>
          <p className="text-lg font-semibold text-gray-700">Inicia sesión para ver tus favoritos</p>
          <p className="text-sm text-gray-400 mt-1">Guarda los productos que más te gustan</p>
        </div>
        <Link href="/login">
          <Button className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <Heart className="h-16 w-16 text-gray-200" />
        <div>
          <p className="text-lg font-semibold text-gray-700">Aún no tienes favoritos</p>
          <p className="text-sm text-gray-400 mt-1">Haz clic en el corazón de cualquier producto para guardarlo aquí</p>
        </div>
        <Link href="/productos">
          <Button className="bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl">
            <ShoppingBag className="h-4 w-4 mr-2" /> Ver productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" /> Mis favoritos
        </h1>
        <p className="text-sm text-gray-500 mt-1">{items.length} producto{items.length !== 1 ? "s" : ""} guardado{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.product.id}
            product={{
              ...item.product,
              price: typeof item.product.price === "number" ? item.product.price : Number(item.product.price),
              salePrice: item.product.salePrice == null ? null
                : typeof item.product.salePrice === "number" ? item.product.salePrice
                : Number(item.product.salePrice),
            }}
          />
        ))}
      </div>
    </div>
  );
}
