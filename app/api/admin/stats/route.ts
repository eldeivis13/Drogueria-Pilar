import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const [
    totalOrders,
    totalProducts,
    totalUsers,
    revenueAgg,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "COMPLETED" },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  return NextResponse.json({
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: revenueAgg._sum.total ?? 0,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    ordersByStatus,
  });
}
