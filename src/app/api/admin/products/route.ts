import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  productId: z.string().min(1, "شناسه محصول الزامی است"),
  name: z.string().min(2, "نام محصول الزامی است"),
  brand: z.string().min(1, "برند الزامی است"),
  category: z.string().min(1, "دسته‌بندی الزامی است"),
  purchasePrice: z.number().positive("قیمت خرید باید مثبت باشد"),
  sellingPrice: z.number().positive("قیمت فروش باید مثبت باشد"),
  imageUrl: z.string().url("آدرس تصویر معتبر نیست"),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

function generateSlug(name: string, id: string) {
  return name.toLowerCase().replace(/[^؀-ۿa-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim().substring(0, 80) + "-" + id;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    const existing = await prisma.product.findUnique({ where: { productId: data.productId } });
    if (existing) return NextResponse.json({ error: "این شناسه محصول قبلاً ثبت شده است" }, { status: 409 });

    let slug = generateSlug(data.name, data.productId);
    const slugExists = await prisma.product.findUnique({ where: { slug } });
    if (slugExists) slug = slug + "-" + Date.now();

    const product = await prisma.product.create({ data: { ...data, slug } });
    return NextResponse.json({ ok: true, product });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors[0].message }, { status: 400 });
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }
  const { id } = await req.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
