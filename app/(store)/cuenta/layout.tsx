import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Gestiona tu perfil, consulta tus pedidos y administra tus datos personales.",
  robots: { index: false, follow: false },
};

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
