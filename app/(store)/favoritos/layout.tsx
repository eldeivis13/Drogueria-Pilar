import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Todos los productos que has guardado en tu lista de favoritos.",
  robots: { index: false, follow: false },
};

export default function FavoritosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
