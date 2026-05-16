import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito de compras",
  description: "Revisa los productos en tu carrito y procede al pago de forma segura.",
};

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
