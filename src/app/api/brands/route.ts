import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.product.groupBy({
      by: ["brand"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    return NextResponse.json(
      brands.map((b) => ({ brand: b.brand, count: b._count.id }))
    );
  } catch (error) {
    console.error("Brands API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
