export function formatPrice(price: number | { toNumber: () => number } | null | undefined): string {
  const value = price == null ? 0 : typeof price === "number" ? price : price.toNumber();
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function calcDiscount(price: number | { toNumber: () => number }, salePrice: number | { toNumber: () => number }): number {
  const p = typeof price === "number" ? price : price.toNumber();
  const s = typeof salePrice === "number" ? salePrice : salePrice.toNumber();
  return Math.round(((p - s) / p) * 100);
}
