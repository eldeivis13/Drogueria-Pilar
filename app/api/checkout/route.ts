import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { getOrCreateCart } from "@/lib/data/cart";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const {
      shippingFirstName,
      shippingLastName,
      shippingStreet,
      shippingCity,
      shippingDepartment,
      shippingPhone,
      shippingPostalCode,
      paymentMethod = "CREDIT_CARD",
    } = body;

    if (!shippingFirstName || !shippingLastName || !shippingStreet || !shippingCity) {
      return NextResponse.json({ error: "Datos de envío incompletos" }, { status: 400 });
    }

    // Obtener carrito
    const cart = await getOrCreateCart(userId);
    if (!cart.items.length) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // Verificar stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para: ${item.product.name}` },
          { status: 400 }
        );
      }
    }

    // Calcular totales
    const subtotal = cart.items.reduce((acc, item) => {
      const price = typeof item.priceSnapshot === "number"
        ? item.priceSnapshot
        : item.priceSnapshot.toNumber();
      return acc + price * item.quantity;
    }, 0);
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    // Crear pedido en BD con estado PENDING
    const orderNumber = `DP-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        paymentMethod: paymentMethod as PaymentMethod,
        subtotal,
        shippingCost: shipping,
        total,
        shippingFirstName,
        shippingLastName,
        shippingStreet,
        shippingCity,
        shippingDepartment: shippingDepartment ?? "España",
        shippingPhone: shippingPhone ?? "",
        shippingPostalCode,
        items: {
          create: cart.items.map((item) => {
            const price = typeof item.priceSnapshot === "number"
              ? item.priceSnapshot
              : item.priceSnapshot.toNumber();
            return {
              productId: item.productId,
              productName: item.product.name,
              productBrand: item.product.brand,
              productSku: item.product.sku,
              quantity: item.quantity,
              unitPrice: price,
              subtotal: price * item.quantity,
            };
          }),
        },
        payment: {
          create: {
            method: paymentMethod as PaymentMethod,
            amount: total,
          },
        },
      },
    });

    // URL base
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    // Crear sesión de Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: "es",
      line_items: [
        ...cart.items.map((item) => {
          const price = typeof item.priceSnapshot === "number"
            ? item.priceSnapshot
            : item.priceSnapshot.toNumber();
          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: item.product.name,
                description: item.product.brand ?? undefined,
              },
              unit_amount: Math.round(price * 100), // en céntimos
            },
            quantity: item.quantity,
          };
        }),
        // Añadir envío si aplica
        ...(shipping > 0 ? [{
          price_data: {
            currency: "eur",
            product_data: { name: "Envío estándar" },
            unit_amount: Math.round(shipping * 100),
          },
          quantity: 1,
        }] : []),
      ],
      metadata: {
        orderId: order.id,
        userId,
      },
      success_url: `${baseUrl}/checkout/exito?orderId=${order.id}`,
      cancel_url: `${baseUrl}/checkout/cancelado?orderId=${order.id}`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[POST /api/checkout]", error);
    return NextResponse.json({ error: "Error al crear la sesión de pago" }, { status: 500 });
  }
}
