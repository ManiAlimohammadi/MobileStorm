"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, truncate } from "@/lib/utils";

export function CartClient() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] pt-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold mb-3">سبد خرید خالی است</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            هنوز هیچ محصولی به سبد خرید اضافه نشده. بیایید خرید را شروع کنیم!
          </p>
          <Button asChild variant="brand" size="lg">
            <Link href="/products">
              <ShoppingBag className="h-5 w-5" />
              مشاهده محصولات
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">سبد خرید</h1>
        <span className="text-sm text-muted-foreground">
          {items.reduce((s, i) => s + i.quantity, 0).toLocaleString("fa-IR")} محصول
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 bg-card rounded-2xl border border-border p-4"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/60 border border-border shrink-0"
                >
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-contain p-2"
                    sizes="112px"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-sm font-semibold text-foreground hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mb-3">{item.product.brand}</p>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="h-7 w-7 rounded-md hover:bg-background transition-colors flex items-center justify-center"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        ) : (
                          <Minus className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="h-7 w-7 rounded-md hover:bg-background transition-colors flex items-center justify-center disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-left">
                      <p className="text-base font-bold text-brand-600">
                        {formatPrice(item.product.sellingPrice * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.product.sellingPrice)} × {item.quantity}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue shopping */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 transition-colors mt-4"
          >
            <ArrowRight className="h-4 w-4" />
            ادامه خرید
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-6">خلاصه سفارش</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1 ml-2">
                    {truncate(item.product.name, 25)} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatPrice(item.product.sellingPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="mb-6" />

            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold">جمع کل:</span>
              <span className="text-xl font-black text-brand-600">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Button asChild variant="brand" size="lg" className="w-full shadow-lg shadow-brand-600/20 mb-3">
              <Link href="/checkout">ادامه و تسویه حساب</Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4" />
              پاک کردن سبد
            </Button>

            {/* Trust */}
            <div className="mt-6 pt-6 border-t border-border space-y-2">
              {["✅ سفارش امن", "🚚 ارسال سریع", "↩️ مرجوعی ۷ روزه"].map((t) => (
                <p key={t} className="text-xs text-muted-foreground">{t}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
