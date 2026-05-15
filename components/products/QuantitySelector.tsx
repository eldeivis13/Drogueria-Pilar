"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

interface QuantitySelectorProps {
  productId: string;
  maxStock: number;
}

export function QuantitySelector({ productId, maxStock }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Cantidad</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
              className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-gray-400">Máx. {maxStock}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <AddToCartButton productId={productId} quantity={quantity} className="flex-1 h-11" />
      </div>
    </div>
  );
}
