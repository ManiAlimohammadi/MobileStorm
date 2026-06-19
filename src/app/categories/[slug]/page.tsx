import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CATEGORY_META } from "@/lib/categories";
import { ProductsClient } from "@/components/products/products-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);
  const meta = CATEGORY_META[categoryName] ?? {};
  return {
    title: `${categoryName} | ایوِیز موبایل`,
    description: (meta as { description?: string }).description ?? `خرید بهترین ${categoryName} از ایوِیز موبایل`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);

  const count = await prisma.product.count({ where: { category: categoryName } });
  if (count === 0) notFound();

  const meta = CATEGORY_META[categoryName] as { emoji?: string; description?: string } | undefined;

  return (
    <div>
      {/* Category header */}
      <div className="bg-gradient-to-b from-brand-50 to-background dark:from-brand-950/20 dark:to-background pt-28 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-3xl">
              {meta?.emoji ?? "📦"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{categoryName}</h1>
              <p className="text-muted-foreground mt-1">{count.toLocaleString("fa-IR")} محصول</p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" /></div>}>
        <ProductsClient defaultCategory={categoryName} hideHeader />
      </Suspense>
    </div>
  );
}
