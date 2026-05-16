"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Package, ArrowRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  salePrice: number | null;
  category: { name: string };
  images: { url: string }[];
}

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch results with debounce
  const fetchResults = useCallback(async (q: string) => {
    if (q.length < MIN_CHARS) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch(
        `/api/products?q=${encodeURIComponent(q)}&limit=6&sort=popular`
      );
      const data = await res.json();
      setResults(data.products ?? []);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(query.trim());
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/productos?q=${encodeURIComponent(q)}`);
  }

  function handleSelect(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/productos/${slug}`);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showDropdown = open && query.length >= MIN_CHARS;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          {/* Search icon / loader */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading
              ? <Loader2 className="h-4 w-4 text-[#7C3AED] animate-spin" />
              : <Search className="h-4 w-4 text-gray-400" />}
          </div>

          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= MIN_CHARS && setOpen(true)}
            placeholder="Buscar productos, marcas, categorías..."
            autoComplete="off"
            className="pl-9 pr-8 bg-white border-gray-200 rounded-xl h-10 text-sm focus-visible:ring-[#7C3AED]"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          size="sm"
          className="h-10 px-4 bg-[#2D1B69] hover:bg-[#4A2D9C] text-white rounded-xl shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center py-8 gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando…
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-center">
              <Package className="h-8 w-8 text-gray-200" />
              <p className="text-sm text-gray-500">
                Sin resultados para <span className="font-semibold">"{query}"</span>
              </p>
            </div>
          ) : (
            <>
              {/* Results list */}
              <ul>
                {results.map((product, i) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(product.slug)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        i === activeIndex
                          ? "bg-purple-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                        {product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-purple-300" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {highlightMatch(product.name, query)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.brand && `${product.brand} · `}
                          {product.category.name}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        {product.salePrice ? (
                          <>
                            <p className="text-sm font-bold text-[#7C3AED]">
                              {formatPrice(Number(product.salePrice))}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(Number(product.price))}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-bold text-gray-800">
                            {formatPrice(Number(product.price))}
                          </p>
                        )}
                      </div>
                    </button>
                    {i < results.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
                  </li>
                ))}
              </ul>

              {/* Footer: ver todos */}
              <div className="border-t border-gray-100 px-4 py-2.5">
                <Link
                  href={`/productos?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between text-sm text-[#7C3AED] font-medium hover:underline"
                >
                  <span>
                    Ver todos los resultados para{" "}
                    <span className="font-bold">"{query}"</span>
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** Resalta en negrita la parte del texto que coincide con el query */
function highlightMatch(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5 font-semibold not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
