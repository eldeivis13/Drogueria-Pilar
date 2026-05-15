# 🛒 Plan Ecommerce — Droguería Pilar

## Stack Tecnológico
- **Frontend:** Next.js 14 (App Router)
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **UI Components:** shadcn/ui + Tailwind CSS
- **Lenguaje:** TypeScript

---

## Fases del Proyecto

### Fase 1 — Diseño UI (ACTUAL) ✅
Construir todas las vistas sin lógica de backend. Datos mock. Objetivo: validar flujos y apariencia.

### Fase 2 — Base de Datos & Prisma
Modelar esquema: productos, categorías, usuarios, pedidos, carrito, reseñas.

### Fase 3 — Backend / API Routes
Rutas Next.js API para CRUD de productos, autenticación, carrito, checkout.

### Fase 4 — Integración & Despliegue
Conectar frontend con backend, pasarela de pago, deploy en Vercel + Railway/Supabase.

---

## Estructura de Carpetas

```
drogueria-pilar/
├── app/
│   ├── (store)/                  # Grupo de rutas de la tienda pública
│   │   ├── layout.tsx            # Layout con sidebar/navbar
│   │   ├── page.tsx              # Home / Dashboard
│   │   ├── productos/
│   │   │   ├── page.tsx          # Catálogo de productos
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Detalle de producto
│   │   ├── categorias/
│   │   │   └── [categoria]/
│   │   │       └── page.tsx      # Productos por categoría
│   │   ├── carrito/
│   │   │   └── page.tsx          # Carrito de compras
│   │   ├── checkout/
│   │   │   └── page.tsx          # Proceso de pago
│   │   └── cuenta/
│   │       └── page.tsx          # Mi cuenta / pedidos
│   ├── (admin)/                  # Panel de administración
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── productos/
│   │   │   └── page.tsx
│   │   └── pedidos/
│   │       └── page.tsx
│   └── api/                      # Fase 3 (pendiente)
├── components/
│   ├── ui/                       # Componentes shadcn generados
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   └── ProductCarousel.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   └── shared/
│       ├── SearchBar.tsx
│       ├── CategoryBadge.tsx
│       └── RatingStars.tsx
├── lib/
│   ├── prisma.ts                 # Cliente Prisma (Fase 2)
│   └── utils.ts
├── data/
│   └── mock.ts                   # Datos mock para Fase 1
├── prisma/
│   └── schema.prisma             # Esquema DB (Fase 2)
├── public/
│   └── images/
└── types/
    └── index.ts                  # Tipos TypeScript
```

---

## Páginas UI — Fase 1

| Página | Ruta | Descripción |
|---|---|---|
| Home | `/` | Banner hero, categorías destacadas, productos featured |
| Catálogo | `/productos` | Grid de productos con filtros y búsqueda |
| Detalle | `/productos/[slug]` | Imagen, descripción, precio, reseñas, botón agregar |
| Carrito | `/carrito` | Lista de items, cantidades, subtotal |
| Checkout | `/checkout` | Formulario de envío y pago (UI only) |
| Mi Cuenta | `/cuenta` | Historial de pedidos, datos personales |
| Admin Dashboard | `/admin/dashboard` | Métricas, ventas recientes |

---

## Paleta de Colores (inspirada en la captura)

| Token | Color | Uso |
|---|---|---|
| `primary` | `#2D1B69` | Sidebar, botones principales |
| `primary-light` | `#4A2D9C` | Hover estados |
| `accent` | `#7C3AED` | Badges, highlights |
| `background` | `#F0EEF8` | Fondo principal |
| `surface` | `#FFFFFF` | Cards de productos |
| `text-primary` | `#1A1A2E` | Títulos |
| `text-muted` | `#6B7280` | Precio secundario, subtítulos |
| `star` | `#F59E0B` | Rating |

---

## Categorías de la Droguería Pilar

- 💊 Medicamentos OTC (sin receta)
- 🧴 Cuidado Personal & Skincare
- 💄 Maquillaje & Cosméticos
- 🌸 Perfumería (hombre / mujer / unisex)
- 🦷 Higiene Oral
- 👶 Bebés & Maternidad
- 🌿 Vitaminas & Suplementos
- 🏠 Higiene del Hogar

---

## Modelo de Datos (Fase 2 — Referencia)

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Decimal
  salePrice   Decimal?
  stock       Int
  images      String[]
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  brand       String?
  rating      Float    @default(0)
  reviews     Review[]
  createdAt   DateTime @default(now())
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  icon     String?
  products Product[]
}

model Order {
  id        String      @id @default(cuid())
  user      User        @relation(fields: [userId], references: [id])
  userId    String
  items     OrderItem[]
  total     Decimal
  status    OrderStatus @default(PENDING)
  createdAt DateTime    @default(now())
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

---

## Próximos Pasos Inmediatos (Fase 1)

1. ✅ Crear plan del proyecto
2. 🔄 Crear layout principal con Sidebar + Navbar
3. 🔄 Página Home con banner y categorías
4. 🔄 Catálogo de productos con datos mock
5. ⏳ Detalle de producto
6. ⏳ Carrito de compras
7. ⏳ Checkout (UI)
8. ⏳ Panel admin (UI)
