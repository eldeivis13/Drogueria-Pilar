// ============================================
// DATOS MOCK — Droguería Pilar (Fase 1 UI)
// Reemplazar con llamadas a Prisma en Fase 2
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: "nuevo" | "oferta" | "popular";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "1", name: "Medicamentos OTC", slug: "medicamentos", icon: "💊", color: "bg-blue-100 text-blue-700", productCount: 48 },
  { id: "2", name: "Skincare", slug: "skincare", icon: "🧴", color: "bg-pink-100 text-pink-700", productCount: 63 },
  { id: "3", name: "Maquillaje", slug: "maquillaje", icon: "💄", color: "bg-rose-100 text-rose-700", productCount: 91 },
  { id: "4", name: "Perfumería", slug: "perfumeria", icon: "🌸", color: "bg-purple-100 text-purple-700", productCount: 55 },
  { id: "5", name: "Higiene Oral", slug: "higiene-oral", icon: "🦷", color: "bg-cyan-100 text-cyan-700", productCount: 29 },
  { id: "6", name: "Bebés", slug: "bebes", icon: "👶", color: "bg-yellow-100 text-yellow-700", productCount: 37 },
  { id: "7", name: "Vitaminas", slug: "vitaminas", icon: "🌿", color: "bg-green-100 text-green-700", productCount: 44 },
  { id: "8", name: "Hogar", slug: "hogar", icon: "🏠", color: "bg-orange-100 text-orange-700", productCount: 22 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Crema Hidratante Neutrogena Hydro Boost",
    slug: "crema-hidratante-neutrogena",
    description: "Hidratación intensa con ácido hialurónico. Textura gel-crema no grasa, absorción rápida. Ideal para todo tipo de piel.",
    price: 18.99,
    salePrice: 14.99,
    image: "/images/products/crema-neutrogena.jpg",
    category: "Skincare",
    categorySlug: "skincare",
    brand: "Neutrogena",
    rating: 4.8,
    reviewCount: 124,
    stock: 18,
    badge: "oferta",
  },
  {
    id: "2",
    name: "Perfume Carolina Herrera Good Girl 80ml",
    slug: "perfume-carolina-herrera-good-girl",
    description: "Fragancia floral oriental con notas de jazmín, cacao y vainilla. Frasco icónico en forma de tacón.",
    price: 89.99,
    image: "/images/products/good-girl.jpg",
    category: "Perfumería",
    categorySlug: "perfumeria",
    brand: "Carolina Herrera",
    rating: 4.9,
    reviewCount: 87,
    stock: 6,
    badge: "popular",
  },
  {
    id: "3",
    name: "Vitamina C 1000mg Redoxon 30 tabletas",
    slug: "vitamina-c-redoxon-1000mg",
    description: "Suplemento vitamínico efervescente. Refuerza el sistema inmune. Sabor naranja. Sin azúcar.",
    price: 8.99,
    image: "/images/products/redoxon.jpg",
    category: "Vitaminas",
    categorySlug: "vitaminas",
    brand: "Redoxon",
    rating: 4.6,
    reviewCount: 203,
    stock: 45,
    badge: "nuevo",
  },
  {
    id: "4",
    name: "Sérum Vitamina C L'Oréal Revitalift",
    slug: "serum-vitamina-c-loreal",
    description: "Sérum facial con 12% de vitamina C pura. Reduce manchas oscuras, unifica el tono. Resultados desde la primera semana.",
    price: 29.99,
    salePrice: 24.99,
    image: "/images/products/serum-loreal.jpg",
    category: "Skincare",
    categorySlug: "skincare",
    brand: "L'Oréal",
    rating: 4.7,
    reviewCount: 156,
    stock: 22,
    badge: "oferta",
  },
  {
    id: "5",
    name: "Base de Maquillaje Maybelline Fit Me 30ml",
    slug: "base-maybelline-fit-me",
    description: "Cobertura media-alta, acabado natural. Controla el brillo por 12 horas. 40 tonos disponibles.",
    price: 12.99,
    image: "/images/products/fit-me.jpg",
    category: "Maquillaje",
    categorySlug: "maquillaje",
    brand: "Maybelline",
    rating: 4.5,
    reviewCount: 311,
    stock: 30,
  },
  {
    id: "6",
    name: "Ibuprofeno 400mg Bayer 20 tabletas",
    slug: "ibuprofeno-400mg-bayer",
    description: "Analgésico y antiinflamatorio. Alivia dolor de cabeza, muscular y fiebre. Venta libre.",
    price: 4.99,
    image: "/images/products/ibuprofeno.jpg",
    category: "Medicamentos OTC",
    categorySlug: "medicamentos",
    brand: "Bayer",
    rating: 4.4,
    reviewCount: 98,
    stock: 80,
  },
  {
    id: "7",
    name: "Perfume Lancôme La Vie Est Belle 100ml",
    slug: "perfume-lancome-la-vie-est-belle",
    description: "Fragancia gourmand floral. Notas de iris, praline y vainilla. El perfume más vendido de Lancôme.",
    price: 110.00,
    salePrice: 94.99,
    image: "/images/products/la-vie-est-belle.jpg",
    category: "Perfumería",
    categorySlug: "perfumeria",
    brand: "Lancôme",
    rating: 4.9,
    reviewCount: 412,
    stock: 4,
    badge: "oferta",
  },
  {
    id: "8",
    name: "Crema Pañalera Bepanthen 100g",
    slug: "crema-panelera-bepanthen",
    description: "Protege y sana la piel del bebé. Con dexpantenol. Dermatológicamente probada. Sin conservantes.",
    price: 9.99,
    image: "/images/products/bepanthen.jpg",
    category: "Bebés",
    categorySlug: "bebes",
    brand: "Bepanthen",
    rating: 4.8,
    reviewCount: 267,
    stock: 35,
    badge: "popular",
  },
];

export const featuredProducts = products.filter(p => p.badge === "popular" || p.rating >= 4.8);
export const saleProducts = products.filter(p => p.salePrice !== undefined);

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(price);
};
