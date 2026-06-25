export const dynamic = "force-dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import { ProductCard } from "@/components/products/product-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};

  const description = `خرید ${product.name} از ایوِیز موبایل | برند ${product.brand} | بهترین قیمت با ضمانت اصالت`;
  return {
    title: product.name,
    description,
    keywords: [product.name, product.brand, product.category, "لوازم جانبی موبایل", "خرید آنلاین"],
    openGraph: {
      title: product.name,
      description,
      images: [{ url: product.imageUrl, alt: product.name }],
      type: "website",
    },
    alternates: { canonical: `/products/${slug}` },
  };
}

async function RelatedProducts({ category, brand, excludeId }: { category: string; brand: string; excludeId: string }) {
  const sameCategoryBrand = await prisma.product.findMany({
    where: { category, brand, id: { not: excludeId } },
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  const sameCategoryOthers = await prisma.product.findMany({
    where: {
      category,
      id: { not: excludeId },
      ...(sameCategoryBrand.length > 0 ? { NOT: { id: { in: sameCategoryBrand.map((p) => p.id) } } } : {}),
    },
    take: 4 - sameCategoryBrand.length,
    orderBy: { featured: "desc" },
  });

  const related = [...sameCategoryBrand, ...sameCategoryOthers];
  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold mb-8">محصولات مشابه</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
      <ProductDetailClient product={product} />
      <Suspense fallback={null}>
        <RelatedProducts category={product.category} brand={product.brand} excludeId={product.id} />
      </Suspense>
    </div>
  );
}
