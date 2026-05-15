"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline";
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  size = "default",
  variant = "default",
}: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleAdd = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error");
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleAdd}
      disabled={status === "loading"}
      className={cn(
        "gap-2 transition-all duration-200",
        variant === "default" && "bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl",
        variant === "outline" && "border-[#2D1B69] text-[#2D1B69] hover:bg-purple-50 rounded-xl",
        status === "success" && "bg-green-600 hover:bg-green-600",
        status === "error" && "bg-red-500 hover:bg-red-500",
        className
      )}
    >
      {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === "success" && <Check className="h-4 w-4" />}
      {status === "idle" || status === "error" ? <ShoppingCart className="h-4 w-4" /> : null}
      {status === "loading" && "Agregando..."}
      {status === "success" && "¡Agregado!"}
      {status === "error" && "Sin stock"}
      {status === "idle" && "Agregar al carrito"}
    </Button>
  );
}
