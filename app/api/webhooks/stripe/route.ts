import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

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
      const order = await prisma.$transaction(async (tx) => {
        // Actualizar estado del pedido y pago
        const updatedOrder = await tx.order.update({
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
          include: {
            items: true,
            user: { select: { email: true, firstName: true } },
          },
        });

        // Descontar stock y actualizar ventas
        for (const item of updatedOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              salesCount: { increment: item.quantity },
            },
          });
        }

        // Vaciar carrito del usuario
        const cart = await tx.cart.findUnique({ where: { userId: updatedOrder.userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        return updatedOrder;
      });

      console.log(`[Stripe Webhook] Pedido ${orderId} marcado como PAID`);

      // Enviar email de confirmación
      await sendOrderConfirmation({
        to: order.user.email,
        firstName: order.user.firstName,
        orderNumber: order.orderNumber,
        items: order.items.map((item) => ({
          productName: item.productName,
          productBrand: item.productBrand,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          subtotal: Number(item.subtotal),
        })),
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        total: Number(order.total),
        shippingStreet: order.shippingStreet,
        shippingCity: order.shippingCity,
        shippingDepartment: order.shippingDepartment,
      });
    } catch (error) {
      console.error("[Stripe Webhook] Error procesando pago:", error);
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
