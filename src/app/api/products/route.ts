import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const querySchema = z.object({
  search: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(["price_asc", "price_desc", "name_asc", "newest"]).optional().default("newest"),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(24),
  featured: z.coerce.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = querySchema.parse(Object.fromEntries(searchParams));

    const where: Prisma.ProductWhereInput = {};

    if (params.search) {
      where.name = { contains: params.search, mode: "insensitive" };
    }
    if (params.brand) {
      where.brand = { equals: params.brand, mode: "insensitive" };
    }
    if (params.category) {
      where.category = { equals: params.category };
    }
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.sellingPrice = {
        ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
        ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
      };
    }
    if (params.featured !== undefined) {
      where.featured = params.featured;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      params.sort === "price_asc" ? { sellingPrice: "asc" }
      : params.sort === "price_desc" ? { sellingPrice: "desc" }
      : params.sort === "name_asc" ? { name: "asc" }
      : { createdAt: "desc" };

    const skip = (params.page - 1) * params.pageSize;

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: params.pageSize }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products, total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
