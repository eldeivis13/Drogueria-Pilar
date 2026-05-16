import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Necesario para que Next.js no parsee el body (Stripe verifica la firma raw)
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Configuración de webhook inválida" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "orderId no encontrado en metadata" }, { status: 400 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Actualizar estado del pedido y pago
        const order = await tx.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentStatus: "COMPLETED",
            payment: {
              update: {
                status: "COMPLETED",
                gatewayRef: session.payment_intent as string,
                gatewayName: "stripe",
                paidAt: new Date(),
              },
            },
          },
          include: { items: true },
        });

        // Descontar stock y actualizar ventas
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              salesCount: { increment: item.quantity },
            },
          });
        }

        // Vaciar carrito del usuario
        const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      });

      console.log(`[Stripe Webhook] Pedido ${orderId} marcado como PAID`);
    } catch (error) {
      console.error("[Stripe Webhook] Error procesando pago:", error);
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
