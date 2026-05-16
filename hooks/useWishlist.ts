"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function useWishlist() {
  const { status } = useSession();
  const [productIds, setProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (status !== "authenticated") { setProductIds(new Set()); return; }
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      const ids = (data.items ?? []).map((i: { product: { id: string } }) => i.product.id);
      setProductIds(new Set(ids));
    } catch {}
  }, [status]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = useCallback(async (productId: string) => {
    if (status !== "authenticated") return;
    const isInWishlist = productIds.has(productId);
    // Optimistic update
    setProductIds((prev) => {
      const next = new Set(prev);
      if (isInWishlist) next.delete(productId);
      else next.add(productId);
      return next;
    });
    setLoading(true);
    try {
      await fetch("/api/wishlist", {
        method: isInWishlist ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    } catch {
      // Revert on error
      setProductIds((prev) => {
        const next = new Set(prev);
        if (isInWishlist) next.add(productId);
        else next.delete(productId);
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [status, productIds]);

  return {
    productIds,
    isFavorite: (id: string) => productIds.has(id),
    toggle,
    loading,
  };
}
