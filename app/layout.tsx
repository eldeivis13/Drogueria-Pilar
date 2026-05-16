import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://drogueria-pilar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Droguería Pilar — Salud y Belleza Online",
    template: "%s | Droguería Pilar",
  },
  description:
    "Tu tienda online de droguería y perfumería. Medicamentos OTC, skincare, maquillaje, perfumes, vitaminas y más. Envío rápido y seguro.",
  keywords: [
    "droguería online", "perfumería", "skincare", "medicamentos",
    "vitaminas", "maquillaje", "belleza", "salud", "comprar online",
  ],
  authors: [{ name: "Droguería Pilar" }],
  creator: "Droguería Pilar",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "Droguería Pilar",
    title: "Droguería Pilar — Salud y Belleza Online",
    description: "Medicamentos OTC, skincare, maquillaje, perfumes y más. Envío rápido y seguro.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Droguería Pilar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Droguería Pilar — Salud y Belleza Online",
    description: "Medicamentos OTC, skincare, maquillaje, perfumes y más.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
