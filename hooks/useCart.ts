"use client";

import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot: number;
  product: {
    id: string;
    name: string;
    brand: string | null;
    slug: string;
    images: { url: string }[];
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Error al cargar carrito");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    try {
      setLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al agregar producto");
      }
      await fetchCart();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      await fetchCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      await fetchCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    }
  }, [fetchCart]);

  const itemCount = cart?.items.reduce((acc, i) => acc + i.quantity, 0) ?? 0;
  const subtotal = cart?.items.reduce((acc, i) => acc + Number(i.priceSnapshot) * i.quantity, 0) ?? 0;

  return { cart, loading, error, itemCount, subtotal, addItem, updateItem, removeItem, refetch: fetchCart };
}
