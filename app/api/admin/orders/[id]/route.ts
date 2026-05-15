import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { OrderStatus } from "@prisma/client";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "DELIVERED") updateData.deliveredAt = new Date();
  if (status === "CANCELLED") updateData.cancelledAt = new Date();

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: true,
      payment: true,
    },
  });

  return NextResponse.json(order);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { include: { product: { select: { name: true, sku: true } } } },
      payment: true,
    },
  });
  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(order);
}
