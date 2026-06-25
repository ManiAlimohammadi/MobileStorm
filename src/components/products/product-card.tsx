"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle2, Star, Heart } from "lucide-react";
import { cn, formatPrice, truncate } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/components/ui/toaster";
import type { Product } from "@/types";
import { CATEGORY_META } from "@/lib/categories";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();
  const wished = inWishlist(product.id);
  const catMeta = CATEGORY_META[product.category];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    toast({ title: "افزوده شد!", description: truncate(product.name, 40) + " به سبد اضافه شد.", variant: "success" });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast({
      title: wished ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد",
      description: truncate(product.name, 40),
      variant: wished ? "default" : "success",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.035, 0.22), ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        <div className="group relative bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-black/6 dark:hover:shadow-black/20 hover:-translate-y-0.5 hover:border-border/80">

          {/* Image */}
          <div className="relative overflow-hidden bg-white dark:bg-zinc-900/60 shrink-0">
            <div className="aspect-square p-4">
              {!imgError ? (
                <div className="relative w-full h-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-108"
                    onError={() => setImgError(true)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-15">
                  {catMeta?.emoji ?? "📦"}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
              {product.featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-brand-600 text-white shadow-sm">
                  <Star className="h-2.5 w-2.5 fill-current" />ویژه
                </span>
              )}
              {product.stock > 0 && product.stock < 5 && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 border border-red-100 dark:border-red-900">
                  آخرین موجودی
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <motion.button
              onClick={handleWishlist}
              whileTap={{ scale: 0.8 }}
              className="absolute top-2.5 left-2.5 z-10 h-7 w-7 flex items-center justify-center rounded-xl bg-card/90 backdrop-blur-sm border border-border/60 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={wished ? "filled" : "empty"}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Heart className={cn("h-3.5 w-3.5 transition-colors", wished ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Category emoji */}
            {catMeta && (
              <div className="absolute bottom-2.5 left-2.5 z-10 h-7 w-7 flex items-center justify-center rounded-lg bg-card/90 backdrop-blur-sm border border-border/60 text-sm shadow-sm">
                {catMeta.emoji}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-3.5 pt-3">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1 truncate">
              {product.brand}
            </p>
            <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 flex-1 mb-3.5 min-h-[2.6rem]">
              {product.name}
            </h3>

            <div className="flex items-center justify-between gap-2">
              <span className="text-base font-black text-foreground tabular-nums">
                {formatPrice(product.sellingPrice)}
              </span>

              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.88 }}
                disabled={product.stock === 0}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-40",
                  added
                    ? "bg-emerald-500 text-white"
                    : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20"
                )}
              >
                {added
                  ? <CheckCircle2 className="h-3.5 w-3.5" />
                  : <ShoppingCart className="h-3.5 w-3.5" />
                }
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted/60" />
      <div className="p-3.5 space-y-2">
        <div className="h-2 bg-muted rounded-full w-1/4" />
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded-full" />
          <div className="h-3 bg-muted rounded-full w-3/4" />
        </div>
        <div className="flex justify-between items-center pt-1.5">
          <div className="h-4 bg-muted rounded-full w-2/5" />
          <div className="h-8 w-8 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}
