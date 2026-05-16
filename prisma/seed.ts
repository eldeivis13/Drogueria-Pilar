// ============================================================
// DROGUERÍA PILAR — Seed de base de datos
// Ejecutar: npx prisma db seed
// ============================================================

import { PrismaClient, Role, PaymentMethod, OrderStatus, PaymentStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Imágenes reales de Unsplash para cada producto
const PRODUCT_IMAGES: Record<string, string> = {
  "crema-hidratante-neutrogena-hydro-boost":
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800&q=80",
  "perfume-carolina-herrera-good-girl-80ml":
    "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
  "vitamina-c-redoxon-1000mg-30-tabletas":
    "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80",
  "serum-vitamina-c-loreal-revitalift-30ml":
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
  "base-maybelline-fit-me-matte-poreless-30ml":
    "https://images.unsplash.com/photo-1631214524020-3c69293fbe46?w=800&q=80",
  "ibuprofeno-bayer-400mg-20-tabletas":
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
  "perfume-lancome-la-vie-est-belle-edp-100ml":
    "https://images.unsplash.com/photo-1588776814546-ec7e7b40b5a8?w=800&q=80",
  "crema-panelera-bepanthen-100g":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  "colgate-total-12-pasta-dental-150ml":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  "omega-3-gnc-1000mg-90-capsulas":
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
};

async function main() {
  console.log("🌱 Iniciando seed de Droguería Pilar...");

  // ----------------------------------------------------------
  // 1. USUARIOS
  // ----------------------------------------------------------
  const adminPassword = await hash("P1l4r$Admin#2026!", 12);
  const customerPassword = await hash("Cliente123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@drogueriapilar.com" },
    update: {},
    create: {
      email: "admin@drogueriapilar.com",
      passwordHash: adminPassword,
      firstName: "David",
      lastName: "Admin",
      phone: "+57 300 000 0001",
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "maria@ejemplo.com" },
    update: {},
    create: {
      email: "maria@ejemplo.com",
      passwordHash: customerPassword,
      firstName: "María",
      lastName: "García",
      phone: "+57 310 555 1234",
      role: Role.CUSTOMER,
      emailVerified: new Date(),
      addresses: {
        create: {
          label: "Casa",
          firstName: "María",
          lastName: "García",
          street: "Cra 7 # 80-45",
          neighborhood: "Chapinero",
          city: "Bogotá",
          department: "Cundinamarca",
          postalCode: "110221",
          phone: "+57 310 555 1234",
          isDefault: true,
        },
      },
    },
  });

  console.log(`✅ Usuarios creados: ${admin.email}, ${customer.email}`);

  // ----------------------------------------------------------
  // 2. CATEGORÍAS
  // ----------------------------------------------------------
  const categoriesData = [
    { name: "Medicamentos OTC",   slug: "medicamentos",  icon: "💊", sortOrder: 1 },
    { name: "Skincare",           slug: "skincare",      icon: "🧴", sortOrder: 2 },
    { name: "Maquillaje",         slug: "maquillaje",    icon: "💄", sortOrder: 3 },
    { name: "Perfumería",         slug: "perfumeria",    icon: "🌸", sortOrder: 4 },
    { name: "Higiene Oral",       slug: "higiene-oral",  icon: "🦷", sortOrder: 5 },
    { name: "Bebés y Maternidad", slug: "bebes",         icon: "👶", sortOrder: 6 },
    { name: "Vitaminas",          slug: "vitaminas",     icon: "🌿", sortOrder: 7 },
    { name: "Hogar",              slug: "hogar",         icon: "🏠", sortOrder: 8 },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isActive: true },
    });
    categories[cat.slug] = created;
  }

  console.log(`✅ ${categoriesData.length} categorías creadas`);

  // ----------------------------------------------------------
  // 3. PRODUCTOS
  // ----------------------------------------------------------
  const productsData = [
    {
      name: "Crema Hidratante Neutrogena Hydro Boost",
      slug: "crema-hidratante-neutrogena-hydro-boost",
      description: "Hidratación intensa con ácido hialurónico. Textura gel-crema no grasa, absorción rápida. Ideal para todo tipo de piel. Dermatológicamente probada.",
      shortDesc: "Hidratación intensa con ácido hialurónico. Absorción rápida.",
      sku: "NEU-HB-001",
      price: 18.99,
      salePrice: 14.99,
      stock: 18,
      brand: "Neutrogena",
      categorySlug: "skincare",
      isFeatured: true,
      tags: ["oferta"],
    },
    {
      name: "Perfume Carolina Herrera Good Girl 80ml EDP",
      slug: "perfume-carolina-herrera-good-girl-80ml",
      description: "Fragancia floral oriental con notas de jazmín, cacao y vainilla. Frasco icónico en forma de tacón. Eau de Parfum de larga duración.",
      shortDesc: "Floral oriental. Notas de jazmín, cacao y vainilla.",
      sku: "CH-GG-080",
      price: 89.99,
      stock: 6,
      brand: "Carolina Herrera",
      categorySlug: "perfumeria",
      isFeatured: true,
      tags: ["popular"],
    },
    {
      name: "Vitamina C Redoxon 1000mg 30 Tabletas",
      slug: "vitamina-c-redoxon-1000mg-30-tabletas",
      description: "Suplemento vitamínico efervescente. Refuerza el sistema inmune. Sabor naranja. Sin azúcar. 30 tabletas efervescentes.",
      shortDesc: "Suplemento vitamínico efervescente. Refuerza el sistema inmune.",
      sku: "RED-C1000-030",
      price: 8.99,
      stock: 45,
      brand: "Redoxon",
      categorySlug: "vitaminas",
      isFeatured: false,
      tags: ["nuevo"],
    },
    {
      name: "Sérum Vitamina C L'Oréal Revitalift 30ml",
      slug: "serum-vitamina-c-loreal-revitalift-30ml",
      description: "Sérum facial con 12% de vitamina C pura. Reduce manchas oscuras y unifica el tono. Resultados visibles desde la primera semana.",
      shortDesc: "12% vitamina C pura. Reduce manchas y unifica el tono.",
      sku: "LOR-RVL-030",
      price: 29.99,
      salePrice: 24.99,
      stock: 22,
      brand: "L'Oréal",
      categorySlug: "skincare",
      isFeatured: true,
      tags: ["oferta"],
    },
    {
      name: "Base Maybelline Fit Me Matte + Poreless 30ml",
      slug: "base-maybelline-fit-me-matte-poreless-30ml",
      description: "Cobertura media a alta con acabado natural. Controla el brillo hasta 12 horas. Fórmula sin aceite, con micropolvos de caolín. 40 tonos disponibles.",
      shortDesc: "Cobertura media-alta. Controla el brillo 12 horas.",
      sku: "MAY-FM-030",
      price: 12.99,
      stock: 30,
      brand: "Maybelline",
      categorySlug: "maquillaje",
      isFeatured: false,
      tags: [],
    },
    {
      name: "Ibuprofeno Bayer 400mg x 20 Tabletas",
      slug: "ibuprofeno-bayer-400mg-20-tabletas",
      description: "Analgésico, antiinflamatorio y antipirético. Alivia el dolor de cabeza, muscular, articular y la fiebre. Venta libre. No requiere fórmula médica.",
      shortDesc: "Analgésico y antiinflamatorio. Venta libre.",
      sku: "BAY-IBU-400",
      price: 4.99,
      stock: 80,
      brand: "Bayer",
      categorySlug: "medicamentos",
      requiresPrescription: false,
      isFeatured: false,
      tags: [],
    },
    {
      name: "Perfume Lancôme La Vie Est Belle EDP 100ml",
      slug: "perfume-lancome-la-vie-est-belle-edp-100ml",
      description: "Fragancia gourmand floral. Notas de iris, praline y vainilla de Madagascar. El perfume más vendido de Lancôme en el mundo.",
      shortDesc: "Gourmand floral. Notas de iris, praline y vainilla.",
      sku: "LAN-LVEB-100",
      price: 110.00,
      salePrice: 94.99,
      stock: 4,
      brand: "Lancôme",
      categorySlug: "perfumeria",
      isFeatured: true,
      tags: ["oferta"],
    },
    {
      name: "Crema Pañalera Bepanthen 100g",
      slug: "crema-panelera-bepanthen-100g",
      description: "Protege y sana la delicada piel del bebé. Fórmula con dexpantenol (pro-vitamina B5). Dermatológicamente probada, sin conservantes ni fragancias.",
      shortDesc: "Protege y sana la piel del bebé. Sin conservantes.",
      sku: "BEP-PAN-100",
      price: 9.99,
      stock: 35,
      brand: "Bepanthen",
      categorySlug: "bebes",
      isFeatured: true,
      tags: ["popular"],
    },
    {
      name: "Colgate Total 12 Pasta Dental 150ml",
      slug: "colgate-total-12-pasta-dental-150ml",
      description: "Protección completa contra caries, sarro, placa bacteriana, manchas y mal aliento. Fórmula con flúor y triclosán. 12 beneficios en 1.",
      shortDesc: "Protección completa 12 en 1 con flúor.",
      sku: "COL-TOT-150",
      price: 3.99,
      stock: 120,
      brand: "Colgate",
      categorySlug: "higiene-oral",
      isFeatured: false,
      tags: [],
    },
    {
      name: "Omega 3 GNC 1000mg x 90 Cápsulas",
      slug: "omega-3-gnc-1000mg-90-capsulas",
      description: "Ácidos grasos esenciales EPA y DHA. Contribuye a la salud cardiovascular y cerebral. 90 cápsulas blandas de aceite de pescado purificado.",
      shortDesc: "EPA y DHA. Salud cardiovascular y cerebral.",
      sku: "GNC-OM3-090",
      price: 24.99,
      salePrice: 19.99,
      stock: 25,
      brand: "GNC",
      categorySlug: "vitaminas",
      isFeatured: false,
      tags: ["oferta"],
    },
  ];

  const createdProducts: Record<string, string> = {};

  for (const p of productsData) {
    const { categorySlug, tags, requiresPrescription, ...data } = p;
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        price: data.price,
        salePrice: data.salePrice ?? null,
        requiresPrescription: requiresPrescription ?? false,
        categoryId: categories[categorySlug].id,
        tags: {
          create: tags.map((name) => ({ name })),
        },
        images: {
          create: [
            {
              url: PRODUCT_IMAGES[data.slug] ?? `https://placehold.co/800x800/EEE9F8/6D28D9?text=${encodeURIComponent(data.name)}`,
              altText: data.name,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });
    createdProducts[data.slug] = product.id;
  }

  console.log(`✅ ${productsData.length} productos creados`);

  // ----------------------------------------------------------
  // 4. RESEÑAS
  // ----------------------------------------------------------
  const reviewsData = [
    {
      productSlug: "crema-hidratante-neutrogena-hydro-boost",
      rating: 5,
      title: "¡Increíble hidratación!",
      body: "Llevo 2 meses usándola y mi piel se ve mucho más luminosa. Se absorbe muy rápido y no se siente grasosa. La recomiendo totalmente.",
    },
    {
      productSlug: "perfume-carolina-herrera-good-girl-80ml",
      rating: 5,
      title: "Mi perfume favorito",
      body: "El aroma es irresistible y dura todo el día. El frasco es precioso, parece una obra de arte. Vale cada peso.",
    },
    {
      productSlug: "serum-vitamina-c-loreal-revitalift-30ml",
      rating: 4,
      title: "Muy bueno, resultados desde la primera semana",
      body: "Mis manchas se han aclarado notablemente. El único contra es que pica un poco al principio, pero eso pasa.",
    },
    {
      productSlug: "crema-panelera-bepanthen-100g",
      rating: 5,
      title: "Esencial para bebés",
      body: "Con mi bebé he probado muchas cremas y esta es la mejor. La piel de él quedó perfecta en dos días. No la cambio por nada.",
    },
  ];

  for (const r of reviewsData) {
    const productId = createdProducts[r.productSlug];
    if (!productId) continue;

    await prisma.review.upsert({
      where: { productId_userId: { productId, userId: customer.id } },
      update: {},
      create: {
        productId,
        userId: customer.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isApproved: true,
      },
    });
  }

  // Actualizar ratings en productos
  for (const [slug, productId] of Object.entries(createdProducts)) {
    const agg = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });
  }

  console.log(`✅ Reseñas creadas y ratings actualizados`);

  // ----------------------------------------------------------
  // 5. CARRITO de ejemplo
  // ----------------------------------------------------------
  const neutrogelaId = createdProducts["crema-hidratante-neutrogena-hydro-boost"];
  const perfumeId    = createdProducts["perfume-carolina-herrera-good-girl-80ml"];

  if (neutrogelaId && perfumeId) {
    await prisma.cart.upsert({
      where: { userId: customer.id },
      update: {},
      create: {
        userId: customer.id,
        items: {
          create: [
            { productId: neutrogelaId, quantity: 2, priceSnapshot: 14.99 },
            { productId: perfumeId,    quantity: 1, priceSnapshot: 89.99 },
          ],
        },
      },
    });
    console.log(`✅ Carrito de ejemplo creado`);
  }

  // ----------------------------------------------------------
  // 6. ORDEN de ejemplo
  // ----------------------------------------------------------
  const customerWithAddress = await prisma.user.findUnique({
    where: { id: customer.id },
    include: { addresses: true },
  });

  if (customerWithAddress && neutrogelaId) {
    const addr = customerWithAddress.addresses[0];
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: "DP-2026-0001" },
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          userId: customer.id,
          orderNumber: "DP-2026-0001",
          status: OrderStatus.DELIVERED,
          paymentMethod: PaymentMethod.CREDIT_CARD,
          paymentStatus: PaymentStatus.COMPLETED,
          subtotal: 29.98,
          shippingCost: 0,
          total: 29.98,
          shippingAddressId: addr?.id,
          shippingFirstName: "María",
          shippingLastName: "García",
          shippingStreet: "Cra 7 # 80-45",
          shippingCity: "Bogotá",
          shippingDepartment: "Cundinamarca",
          shippingPhone: "+57 310 555 1234",
          deliveredAt: new Date("2026-05-10"),
          items: {
            create: [
              {
                productId: neutrogelaId,
                productName: "Crema Hidratante Neutrogena Hydro Boost",
                productBrand: "Neutrogena",
                productSku: "NEU-HB-001",
                quantity: 2,
                unitPrice: 14.99,
                subtotal: 29.98,
              },
            ],
          },
          payment: {
            create: {
              method: PaymentMethod.CREDIT_CARD,
              status: PaymentStatus.COMPLETED,
              amount: 29.98,
              gatewayName: "wompi",
              gatewayRef: "WMP-TXN-000001",
              paidAt: new Date("2026-05-08"),
            },
          },
        },
      });
      console.log(`✅ Orden de ejemplo creada: DP-2026-0001`);
    } else {
      console.log(`⏭️  Orden DP-2026-0001 ya existe, omitiendo`);
    }
  }

  console.log("\n🎉 Seed completado exitosamente.");
  console.log("─────────────────────────────────────────");
  console.log("  Admin:    admin@drogueriapilar.com / P1l4r$Admin#2026!");
  console.log("  Cliente:  maria@ejemplo.com / Cliente123!");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
