import { prisma } from "@/lib/prisma";

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
        orderBy: { addedAt: "desc" },
      },
    },
  });
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
  });
  if (!product) throw new Error("Producto no encontrado");
  if (product.stock < quantity) throw new Error("Stock insuficiente");

  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find((i) => i.productId === productId);

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (product.stock < newQty) throw new Error("Stock insuficiente");
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: newQty,
        priceSnapshot: product.salePrice ?? product.price,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      priceSnapshot: product.salePrice ?? product.price,
    },
  });
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

export async function removeFromCart(itemId: string) {
  return prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  return prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export function calcCartTotals(items: { quantity: number; priceSnapshot: number | { toNumber: () => number } }[]) {
  const subtotal = items.reduce((acc, item) => {
    const price = typeof item.priceSnapshot === "number"
      ? item.priceSnapshot
      : item.priceSnapshot.toNumber();
    return acc + price * item.quantity;
  }, 0);
  const shipping = subtotal >= 80000 ? 0 : 8900;
  return { subtotal, shipping, total: subtotal + shipping };
}
