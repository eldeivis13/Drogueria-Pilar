import { MetadataRoute } from "next";

const BASE_URL = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://drogueria-pilar.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/", "/cuenta/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
