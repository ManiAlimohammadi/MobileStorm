import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/email";
import { generateTrackingCode } from "@/lib/tracking";
import { z } from "zod";

const orderSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
  phone: z.string().regex(/^(\+98|0)?9[0-9]{9}$/, "شماره موبایل معتبر نیست"),
  address: z.string().min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد"),
  notes: z.string().optional(),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(100) }))
    .min(1, "سبد خرید خالی است"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    // Fetch + validate products
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "برخی محصولات یافت نشدند" }, { status: 400 });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const totalAmount = data.items.reduce((sum, item) => {
      return sum + productMap.get(item.productId)!.sellingPrice * item.quantity;
    }, 0);

    const trackingCode = generateTrackingCode();

    // Ensure unique tracking code
    let finalTrackingCode = trackingCode;
    let codeExists = await prisma.order.findUnique({ where: { trackingCode } });
    while (codeExists) {
      finalTrackingCode = generateTrackingCode();
      codeExists = await prisma.order.findUnique({ where: { trackingCode: finalTrackingCode } });
    }

    // Save order
    const order = await prisma.order.create({
      data: {
        trackingCode: finalTrackingCode,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        totalAmount,
        emailSent: false,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)!.sellingPrice,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Send email (non-blocking — order is already saved)
    sendOrderEmail({
      orderId: order.id,
      trackingCode: order.trackingCode,
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      address: order.address,
      notes: order.notes ?? undefined,
      items: order.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.price,
      })),
      totalAmount: order.totalAmount,
      createdAt: new Date(order.createdAt).toLocaleString("fa-IR"),
    })
      .then(() => prisma.order.update({ where: { id: order.id }, data: { emailSent: true } }))
      .catch((err) => console.error("📧 Email failed for order", order.trackingCode, ":", err.message));

    return NextResponse.json({
      id: order.id,
      trackingCode: order.trackingCode,
      success: true,
      message: "سفارش شما با موفقیت ثبت شد",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات ارسالی معتبر نیست", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
  }
}
