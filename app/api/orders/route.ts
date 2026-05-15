import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart, calcCartTotals } from "@/lib/data/cart";
import { PaymentMethod } from "@prisma/client";
import { auth } from "@/auth";

// GET /api/orders — historial de pedidos
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}

// POST /api/orders — crear pedido desde el carrito
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await req.json();
    const {
      paymentMethod = "CREDIT_CARD",
      shippingFirstName,
      shippingLastName,
      shippingStreet,
      shippingCity,
      shippingDepartment,
      shippingPhone,
      shippingPostalCode,
    } = body;

    // Validar campos de envío
    if (!shippingFirstName || !shippingLastName || !shippingStreet || !shippingCity) {
      return NextResponse.json({ error: "Datos de envío incompletos" }, { status: 400 });
    }

    // Obtener carrito con items
    const cart = await getOrCreateCart(userId);
    if (!cart.items.length) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // Verificar stock de todos los productos
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para: ${item.product.name}` },
          { status: 400 }
        );
      }
    }

    const { subtotal, shipping, total } = calcCartTotals(cart.items);

    // Crear pedido en transacción
    const order = await prisma.$transaction(async (tx) => {
      // 1. Crear la orden
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber: `DP-${Date.now()}`,
          paymentMethod: paymentMethod as PaymentMethod,
          subtotal,
          shippingCost: shipping,
          total,
          shippingFirstName,
          shippingLastName,
          shippingStreet,
          shippingCity,
          shippingDepartment: shippingDepartment ?? "Colombia",
          shippingPhone,
          shippingPostalCode,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productBrand: item.product.brand,
              productSku: item.product.sku,
              quantity: item.quantity,
              unitPrice: item.priceSnapshot,
              subtotal: Number(item.priceSnapshot) * item.quantity,
            })),
          },
          payment: {
            create: {
              method: paymentMethod as PaymentMethod,
              amount: total,
            },
          },
        },
        include: { items: true, payment: true },
      });

      // 2. Descontar stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      // 3. Vaciar carrito
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al crear pedido";
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
