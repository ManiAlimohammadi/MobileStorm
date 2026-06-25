"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice, truncate } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

export function WishlistClient() {
  const { items, toggle } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  function handleMoveToCart(product: typeof items[0]) {
    addToCart(product);
    toggle(product);
    toast({ title: "به سبد اضافه شد", description: truncate(product.name, 40), variant: "success" });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-black">علاقه‌مندی‌ها</h1>
        {items.length > 0 && (
          <span className="text-sm text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
            {items.length.toLocaleString("fa-IR")} محصول
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6">
            <Heart className="h-9 w-9 text-red-300" />
          </div>
          <h2 className="text-xl font-bold mb-2">هنوز محصولی ذخیره نکرده‌اید</h2>
          <p className="text-muted-foreground text-sm mb-8">روی آیکون قلب روی محصولات کلیک کنید تا اینجا ذخیره شوند</p>
          <Link href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition">
            <ArrowLeft className="h-4 w-4" /> مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className="bg-card border rounded-2xl p-4 flex gap-4 items-start group"
              >
                <Link href={`/products/${product.slug}`} className="shrink-0">
                  <div className="w-20 h-20 rounded-xl border bg-white dark:bg-zinc-900 overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
                  <Link href={`/products/${product.slug}`}>
                    <p className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">{product.name}</p>
                  </Link>
                  <p className="text-base font-black text-primary mt-2">{formatPrice(product.sellingPrice)}</p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    title="افزودن به سبد"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => toggle(product)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="حذف"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
