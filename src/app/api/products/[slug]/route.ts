import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products (same brand, excluding current)
    const related = await prisma.product.findMany({
      where: {
        brand: product.brand,
        id: { not: product.id },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ product, related });
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
