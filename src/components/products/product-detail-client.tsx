"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, ChevronRight, Shield, Truck,
  CheckCircle2, Minus, Plus, Star, Tag,
  RotateCcw, Headphones, ChevronDown, ChevronUp,
  Package, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/ui/toaster";
import { formatPrice, truncate } from "@/lib/utils";
import { generateProductContent } from "@/lib/product-content";
import { CATEGORY_META } from "@/lib/categories";
import type { Product } from "@/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const addItem = useCartStore((s) => s.addItem);

  const catMeta = CATEGORY_META[product.category];
  const content = generateProductContent({
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.sellingPrice,
  });

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    toast({ title: "افزوده شد!", description: truncate(product.name, 40) + " به سبد اضافه شد.", variant: "success" });
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">خانه</Link>
        <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
        <Link href="/products" className="hover:text-foreground transition-colors">محصولات</Link>
        {catMeta && (
          <>
            <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
            <Link href={`/categories/${encodeURIComponent(product.category)}`}
              className="hover:text-foreground transition-colors flex items-center gap-1">
              <span>{catMeta.emoji}</span>
              <span>{product.category}</span>
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
        <span className="text-foreground/70 line-clamp-1">{truncate(product.name, 50)}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

        {/* === LEFT: Image gallery === */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-3"
        >
          {/* Main image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/60 border border-border">
            {!imgError ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-10 transition-transform duration-700 hover:scale-105"
                onError={() => setImgError(true)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="text-8xl opacity-10">{catMeta?.emoji ?? "📦"}</span>
                <p className="text-xs text-muted-foreground">تصویر موجود نیست</p>
              </div>
            )}

            {/* Overlays */}
            {product.featured && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
                  <Star className="h-3 w-3 fill-current" />محصول ویژه
                </span>
              </div>
            )}
            {catMeta && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-3 py-1.5 text-xs font-medium shadow-sm">
                <span className="text-base">{catMeta.emoji}</span>
                <span>{product.category}</span>
              </div>
            )}
          </div>

          {/* Thumbnails row (same image zoomed/at different context — shows multiple angles aesthetic) */}
          {!imgError && (
            <div className="grid grid-cols-4 gap-2">
              {[
                { scale: "scale-100", label: "نمای اصلی" },
                { scale: "scale-110", label: "نمای نزدیک" },
                { scale: "scale-[0.75]", label: "نمای کلی" },
                { scale: "scale-102", label: "جزئیات" },
              ].map((thumb, i) => (
                <div key={i}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-zinc-900/60 border-2 transition-all cursor-pointer ${i === 0 ? "border-brand-600 shadow-md shadow-brand-600/20" : "border-border hover:border-brand-300"}`}>
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} - ${thumb.label}`}
                    fill
                    className={`object-contain p-2 ${thumb.scale}`}
                    sizes="80px"
                    onError={() => {}}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Trust signals under image */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              { icon: Shield, text: "ضمانت اصالت کالا" },
              { icon: Truck, text: "ارسال سریع ۱–۳ روزه" },
              { icon: RotateCcw, text: "مرجوعی ۷ روزه" },
              { icon: Headphones, text: "پشتیبانی ۲۴/۷" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 rounded-xl bg-muted/40 border border-border/50 px-3 py-2.5">
                <Icon className="h-4 w-4 text-brand-600 shrink-0" />
                <span className="text-xs font-medium text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* === RIGHT: Buy panel === */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="lg:sticky lg:top-24">
            {/* Brand */}
            <Link href={`/products?brand=${encodeURIComponent(product.brand)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 mb-3 uppercase tracking-wide">
              <Tag className="h-3 w-3" />
              {product.brand}
            </Link>

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl font-bold leading-snug text-foreground mb-5">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="rounded-2xl bg-gradient-to-bl from-brand-50 via-brand-50/50 to-violet-50/50 dark:from-brand-950/40 dark:via-brand-950/20 dark:to-violet-950/20 border border-brand-100 dark:border-brand-900/40 p-5 mb-5">
              <p className="text-xs text-muted-foreground mb-1">قیمت فروش</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-foreground tabular-nums">
                  {product.sellingPrice.toLocaleString("fa-IR")}
                </span>
                <span className="text-base font-semibold text-muted-foreground">تومان</span>
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-2">شامل مالیات ارزش افزوده</p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              {product.stock > 0 ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {product.stock <= 3 ? `فقط ${product.stock} عدد باقی مانده` :
                     product.stock <= 10 ? `${product.stock} عدد موجود` : "موجود در انبار"}
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-600">ناموجود</span>
                </>
              )}
            </div>

            {/* Key features quick list */}
            <div className="space-y-2 mb-6 pb-6 border-b border-border">
              {content.features.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-snug">{f}</span>
                </div>
              ))}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-muted-foreground">تعداد:</span>
              <div className="flex items-center rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <div className="h-10 w-12 flex items-center justify-center text-sm font-bold border-x border-border">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= (product.stock || 99)}
                  className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-30">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                variant="brand"
                size="xl"
                className="w-full font-bold text-base shadow-xl shadow-brand-600/20 transition-all"
              >
                {added ? (
                  <><CheckCircle2 className="h-5 w-5" />افزوده شد!</>
                ) : (
                  <><ShoppingCart className="h-5 w-5" />افزودن به سبد خرید</>
                )}
              </Button>
              <Button asChild size="xl" className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold text-base">
                <Link href="/checkout">خرید فوری ←</Link>
              </Button>
            </div>

            {/* Product ID */}
            <p className="mt-4 text-[11px] text-muted-foreground/40 font-mono text-center">
              کد محصول: {product.productId}
            </p>
          </div>
        </motion.div>
      </div>

      {/* === PRODUCT CONTENT — full width below === */}
      <div className="space-y-0 border border-border rounded-3xl overflow-hidden divide-y divide-border">

        {/* Overview */}
        <section className="p-6 md:p-8 lg:p-10 bg-card">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-950/60 text-brand-600 text-base">✦</span>
              معرفی محصول
            </h2>
            <p className="text-muted-foreground leading-relaxed text-[15px]">{content.overview}</p>
          </div>
        </section>

        {/* Features + Benefits in 2 cols */}
        <section className="p-6 md:p-8 lg:p-10 bg-muted/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold mb-5">ویژگی‌های کلیدی</h2>
              <ul className="space-y-3">
                {content.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 mt-0.5 items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold">{i + 1}</span>
                    <span className="text-sm text-muted-foreground leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-5">مزایا و کاربردها</h2>
              <ul className="space-y-2.5">
                {content.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              {content.usageScenarios.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">موارد استفاده</h3>
                  <ul className="space-y-1.5">
                    {content.usageScenarios.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ArrowLeft className="h-3.5 w-3.5 mt-0.5 text-brand-600 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="p-6 md:p-8 lg:p-10 bg-card">
          <h2 className="text-xl font-bold mb-6">مشخصات فنی</h2>
          <div className="max-w-2xl rounded-2xl overflow-hidden border border-border">
            {[
              ...content.specs,
              { label: "برند", value: product.brand },
              { label: "کد محصول", value: product.productId },
              { label: "دسته‌بندی", value: product.category },
              { label: "موجودی", value: product.stock > 0 ? `${product.stock} عدد` : "ناموجود" },
            ].map((spec, i, arr) => (
              <div key={i} className={`flex items-start px-5 py-3.5 gap-6 text-sm ${i % 2 === 0 ? "bg-muted/30" : ""} ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <span className="w-36 shrink-0 text-muted-foreground font-medium">{spec.label}</span>
                <span className="text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="p-6 md:p-8 lg:p-10 bg-muted/20">
          <h2 className="text-xl font-bold mb-6">سؤالات متداول</h2>
          <div className="max-w-2xl space-y-2">
            {content.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {openFaq === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-0 border-t border-border bg-muted/20">
                        <p className="text-sm text-muted-foreground leading-relaxed pt-3">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Why buy from us */}
        <section className="p-6 md:p-8 lg:p-10 bg-card">
          <h2 className="text-xl font-bold mb-6">چرا از ایوِیز موبایل خرید کنیم؟</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "ضمانت اصالت", desc: "تمامی محصولات ما ۱۰۰٪ اصل و دارای ضمانت‌نامه هستند" },
              { icon: Truck, title: "ارسال سریع", desc: "ارسال ظرف ۱ تا ۳ روز کاری به سراسر کشور" },
              { icon: RotateCcw, title: "مرجوعی ۷ روزه", desc: "هرگونه نارضایتی، محصول را برگردانید" },
              { icon: Package, title: "بسته‌بندی مطمئن", desc: "بسته‌بندی استاندارد برای جلوگیری از آسیب" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-950/60 mb-3">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
