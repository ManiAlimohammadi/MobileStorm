export const dynamic = "force-dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PromoBanner } from "@/components/home/promo-banner";
import { BenefitsSection } from "@/components/home/benefits-section";
import { FaqSection } from "@/components/home/faq-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { CinemaShowcase, CinemaShowcaseSkeleton } from "@/components/home/cinema-showcase";
import { ProductCard, ProductCardSkeleton } from "@/components/products/product-card";

export const metadata: Metadata = {
  title: "ایوِیز موبایل | لوازم جانبی موبایل",
  description: "خرید آنلاین بهترین لوازم جانبی موبایل با بیش از ۴۸۰۰ محصول از برندهای معتبر جهانی.",
};


async function CinemaFetcher() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 }, imageUrl: { not: "" } },
    take: 12,
    orderBy: { sellingPrice: "desc" },
  });
  if (products.length < 8) return null;
  return <CinemaShowcase products={products} />;
}

async function CategoriesFetcher() {
  const cats = await prisma.product.groupBy({
    by: ["category"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });
  return <CategoriesSection categories={cats.map((c) => ({ category: c.category, count: c._count.id }))} />;
}

async function FeaturedSection() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 10,
    orderBy: { sellingPrice: "asc" },
  });
  return <FeaturedProducts products={products} />;
}

async function PopularSection() {
  const topBrands = await prisma.product.groupBy({
    by: ["brand"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });
  const brandNames = topBrands.map((b) => b.brand);
  const products = await prisma.product.findMany({
    where: { brand: { in: brandNames } },
    take: 10,
    orderBy: { sellingPrice: "desc" },
  });

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">برندهای برتر</p>
            <h2 className="text-3xl font-black">محبوب‌ترین محصولات</h2>
          </div>
          <Link href="/products?sort=price_desc"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            مشاهده همه
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

async function DiscoverSection() {
  const products = await prisma.product.findMany({
    where: { category: { in: ["لوازم جانبی", "هاب و تبدیل", "پایه و نگهدارنده"] } },
    take: 10,
    orderBy: { sellingPrice: "asc" },
  });
  const items = products.length >= 5 ? products : await prisma.product.findMany({
    take: 10,
    skip: 300,
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">کشف کنید</p>
            <h2 className="text-3xl font-black">محصولات پیشنهادی</h2>
          </div>
          <Link href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            مشاهده همه
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-48 bg-muted/60 rounded-xl animate-pulse mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}


export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Cinema showcase */}
      <Suspense fallback={<CinemaShowcaseSkeleton />}>
        <CinemaFetcher />
      </Suspense>

      {/* Categories grid */}
      <Suspense fallback={<div className="h-72 bg-muted/20 animate-pulse" />}>
        <CategoriesFetcher />
      </Suspense>

      {/* Featured products */}
      <Suspense fallback={<GridSkeleton />}>
        <FeaturedSection />
      </Suspense>

      <PromoBanner />

      {/* Popular by brand */}
      <Suspense fallback={<GridSkeleton />}>
        <PopularSection />
      </Suspense>

      {/* Discover section */}
      <Suspense fallback={<GridSkeleton />}>
        <DiscoverSection />
      </Suspense>

      <BenefitsSection />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
