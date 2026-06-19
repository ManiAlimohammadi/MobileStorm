"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/* ---------- Tile ---------- */
function ProductTile({ product, priority }: { product: Product; priority?: boolean }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex-none w-40 sm:w-48"
      tabIndex={-1}
      draggable={false}
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-brand-300 dark:group-hover:border-brand-700 group-hover:-translate-y-1">
        <div className="relative aspect-square bg-white dark:bg-zinc-900/80 p-3">
          {!imgErr && product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority={priority}
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              sizes="192px"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20 select-none">
              📦
            </div>
          )}
        </div>
        <div className="px-3 py-2.5 border-t border-border/50">
          <p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider truncate mb-0.5">
            {product.brand}
          </p>
          <p className="text-xs font-medium text-foreground line-clamp-1 mb-1.5 leading-snug">
            {product.name}
          </p>
          <p className="text-sm font-black text-foreground tabular-nums">
            {formatPrice(product.sellingPrice)}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ---------- One infinite-scroll track ---------- */
function MarqueeTrack({
  products,
  reverse,
  speed,
}: {
  products: Product[];
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = [...products, ...products];
  const dur = speed ?? 40;
  const cls = reverse ? "animate-marquee-rtl" : "animate-marquee-ltr";

  return (
    <div className="overflow-hidden group/track mb-3 last:mb-0">
      {/* dir=ltr keeps translateX behaviour predictable in RTL pages */}
      <div
        dir="ltr"
        className={`flex gap-3 ${cls} group-hover/track:[animation-play-state:paused]`}
        style={{ width: "max-content", animationDuration: `${dur}s` }}
      >
        {doubled.map((p, i) => (
          <ProductTile
            key={`${reverse ? "r" : "f"}-${p.id}-${i}`}
            product={p}
            priority={i < 6}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Skeleton ---------- */
function Skeleton() {
  return (
    <section className="relative py-16 border-y border-border/50 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="text-center mb-10 px-4">
        <div className="inline-flex h-8 w-64 bg-muted/50 rounded-full animate-pulse mb-4" />
        <div className="h-8 w-72 bg-muted/40 rounded-xl animate-pulse mx-auto mb-2" />
        <div className="h-4 w-48 bg-muted/30 rounded animate-pulse mx-auto" />
      </div>
      <div className="overflow-hidden mb-3">
        <div className="flex gap-3 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-none w-40 sm:w-48 rounded-2xl border border-border bg-card animate-pulse">
              <div className="aspect-square rounded-t-2xl bg-muted/40" />
              <div className="p-3 space-y-1.5 border-t border-border/50">
                <div className="h-2 bg-muted/60 rounded w-1/3" />
                <div className="h-3 bg-muted/50 rounded" />
                <div className="h-4 bg-muted/70 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-3 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-none w-40 sm:w-48 rounded-2xl border border-border bg-card animate-pulse">
              <div className="aspect-square rounded-t-2xl bg-muted/30" />
              <div className="p-3 space-y-1.5 border-t border-border/50">
                <div className="h-2 bg-muted/50 rounded w-1/4" />
                <div className="h-3 bg-muted/40 rounded w-4/5" />
                <div className="h-4 bg-muted/60 rounded w-2/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Main export ---------- */
export function ProductMarqueeSection() {
  const [row1, setRow1] = useState<Product[]>([]);
  const [row2, setRow2] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch("/api/products?pageSize=32&sort=price_desc")
      .then((r) => r.json())
      .then((data) => {
        const all: Product[] = data.products ?? [];
        if (all.length < 4) return;
        const mid = Math.ceil(all.length / 2);
        setRow1(all.slice(0, mid));
        setRow2(all.slice(mid));
        setReady(true);
      })
      .catch(() => {/* silently skip marquee on error */});
  }, []);

  if (!ready) return <Skeleton />;

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background border-y border-border/50">
      {/* Edge gradients */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 z-10 bg-gradient-to-l from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 z-10 bg-gradient-to-r from-background to-transparent" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 text-center mb-10 px-4"
      >
        <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 rounded-full px-4 py-1.5 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          بیش از ۴۸۰۰ محصول برای انتخاب
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
          اکسسوری برای هر نیاز
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          از شارژر و کابل تا هندزفری و پاوربانک — همه با قیمت تضمینی
        </p>
      </motion.div>

      {/* Tracks — hover any track to pause it */}
      <MarqueeTrack products={row1} speed={38} />
      <MarqueeTrack products={row2} reverse speed={46} />
    </section>
  );
}
