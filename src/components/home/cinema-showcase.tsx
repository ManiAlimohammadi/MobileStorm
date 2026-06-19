"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/* ─── constants ────────────────────────────────────────────────── */

const USAGE = [
  { emoji: "🏃", text: "در ورزش" },
  { emoji: "⚡", text: "شارژ فوری" },
  { emoji: "🛡️", text: "محافظ دستت" },
  { emoji: "🎵", text: "صدای عالی" },
  { emoji: "🔋", text: "انرژی دائم" },
  { emoji: "✈️", text: "همراه سفر" },
];

const SCENARIOS = [
  { emoji: "🏃‍♂️", label: "در ورزش", from: "from-orange-500", to: "to-red-500" },
  { emoji: "✈️", label: "در سفر", from: "from-sky-500", to: "to-blue-600" },
  { emoji: "💼", label: "سر کار", from: "from-violet-500", to: "to-purple-600" },
  { emoji: "🎮", label: "گیمینگ", from: "from-green-500", to: "to-emerald-600" },
  { emoji: "🏠", label: "در خانه", from: "from-amber-500", to: "to-orange-500" },
];

const STATS = [
  { value: "۴٬۸۰۰+", label: "محصول" },
  { value: "۲۰۰+", label: "برند معتبر" },
  { value: "۱۳", label: "دسته‌بندی" },
  { value: "۲ روز", label: "ارسال سریع" },
];

/* ─── FloatingCard ──────────────────────────────────────────────── */

function FloatingCard({
  product,
  usage,
  wrapClass,
  floatY,
  dur,
  delay,
  deg,
}: {
  product: Product;
  usage: { emoji: string; text: string };
  wrapClass: string;       // absolute positioning + visibility
  floatY: number[];
  dur: number;
  delay: number;
  deg: number;             // static tilt in degrees
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      className={`${wrapClass} z-20`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: floatY }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ rotate: deg }}
      >
        <Link href={`/products/${product.slug}`} tabIndex={-1}>
          <div className="relative w-[112px] sm:w-[130px] cursor-pointer group">
            {/* usage badge */}
            <div className="absolute -top-2.5 right-2 z-10 flex items-center gap-1 bg-zinc-900/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-lg border border-zinc-700/60">
              <span className="text-[11px] leading-none">{usage.emoji}</span>
              <span className="text-[9px] font-bold text-zinc-200 leading-none">{usage.text}</span>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.55),0_4px_12px_rgba(0,0,0,0.35)] group-hover:scale-[1.04] transition-transform duration-300">
              {/* image */}
              <div className="aspect-square bg-zinc-50 relative">
                {!imgErr && product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    sizes="130px"
                    onError={() => setImgErr(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">📦</div>
                )}
              </div>
              {/* info */}
              <div className="px-2.5 py-2 border-t border-zinc-100">
                <p className="text-[8px] font-bold text-brand-600 uppercase tracking-wider truncate leading-none">{product.brand}</p>
                <p className="text-[9px] font-medium text-zinc-700 line-clamp-1 mt-0.5 leading-snug">{product.name}</p>
                <p className="text-[10px] font-black text-zinc-900 mt-1 tabular-nums leading-none">{formatPrice(product.sellingPrice)}</p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─── PhoneMockup ───────────────────────────────────────────────── */

function PhoneMockup({ products }: { products: Product[] }) {
  const [idx, setIdx] = useState(0);
  const p = products[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % products.length), 2800);
    return () => clearInterval(t);
  }, [products.length]);

  return (
    <div className="relative select-none shrink-0" style={{ width: 194, height: 400 }}>
      {/* Pulsing ambient glow */}
      <motion.div
        className="absolute -inset-12 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"
        animate={{ opacity: [0.4, 0.75, 0.4], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-6 rounded-full bg-violet-500/15 blur-2xl pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Sparkle particles */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i * 60) * (Math.PI / 180);
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand-400 pointer-events-none"
            style={{ top: "50%", left: "50%" }}
            animate={{
              x: [0, Math.sin(angle) * 120, 0],
              y: [0, -Math.cos(angle) * 120, 0],
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.46, ease: "easeOut" }}
          />
        );
      })}

      {/* Phone body */}
      <div className="relative w-full h-full rounded-[40px] border-[7px] border-zinc-700/90 bg-zinc-950 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_60px_120px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.07)]">

        {/* Dynamic island */}
        <div className="absolute top-3 inset-x-0 flex justify-center z-30">
          <motion.div
            className="h-[22px] rounded-full bg-black border border-zinc-800 flex items-center justify-center gap-1.5 px-3"
            animate={{ width: ["72px", "80px", "72px"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <div className="w-2 h-2 rounded-full bg-zinc-800 ring-1 ring-zinc-600" />
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
          </motion.div>
        </div>

        {/* Status bar */}
        <div className="absolute top-0.5 inset-x-2 h-7 z-20 flex items-center justify-between px-1.5">
          <span className="text-[8px] font-semibold text-white/40 mt-1">۱۲:۴۵</span>
          <div className="flex items-center gap-0.5 mt-1">
            {[1.5, 2.2, 2.8, 3.4].map((h, i) => (
              <div key={i} className="w-[3px] rounded-[1px] bg-white/40" style={{ height: h * 2 }} />
            ))}
            <div className="mr-0.5 w-4 h-2 rounded-[2px] border border-white/35 flex items-center px-[1px]">
              <div className="w-2.5 h-[6px] rounded-[1px] bg-white/40" />
            </div>
          </div>
        </div>

        {/* Screen */}
        <div className="absolute inset-0 flex flex-col bg-white">
          {/* App header */}
          <div className="shrink-0 bg-zinc-900 pt-11 pb-2.5 px-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-brand-600 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-white stroke-2">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <span className="text-[9px] font-black text-white tracking-tight">ایوِیز موبایل</span>
            </div>
            <div className="flex gap-1.5">
              {[0, 1].map(i => (
                <div key={i} className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700/60" />
              ))}
            </div>
          </div>

          {/* Product image */}
          <div className="flex-1 relative overflow-hidden bg-zinc-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.38 }}
                className="absolute inset-0"
              >
                {p?.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p?.name ?? ""}
                    fill
                    className="object-contain p-4"
                    sizes="180px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">📦</div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Dots indicator */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === idx ? "w-3.5 h-1.5 bg-brand-600" : "w-1.5 h-1.5 bg-zinc-300"}`}
                />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="shrink-0 bg-white px-3 py-2.5 border-t border-zinc-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-[7px] font-bold text-brand-600 uppercase tracking-widest truncate">{p?.brand}</p>
                <p className="text-[9px] font-semibold text-zinc-800 line-clamp-1 mt-0.5 leading-tight">{p?.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[11px] font-black text-zinc-900 tabular-nums">{p ? formatPrice(p.sellingPrice) : ""}</p>
                  <div className="bg-brand-600 rounded-full px-2.5 py-0.5 shadow-sm">
                    <span className="text-[8px] font-bold text-white">خرید</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Home bar */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center z-30">
          <div className="w-10 h-[3px] rounded-full bg-zinc-600/60" />
        </div>
      </div>

      {/* Physical buttons */}
      <div className="absolute top-20 -right-[9px] w-[3px] h-7 rounded-full bg-zinc-600" />
      <div className="absolute top-32 -right-[9px] w-[3px] h-5 rounded-full bg-zinc-600" />
      <div className="absolute top-40 -right-[9px] w-[3px] h-5 rounded-full bg-zinc-600" />
      <div className="absolute top-28 -left-[9px] w-[3px] h-12 rounded-full bg-zinc-600" />
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────── */

export function CinemaShowcaseSkeleton() {
  return (
    <section className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="h-7 w-36 bg-zinc-800/60 rounded-full mx-auto mb-5 animate-pulse" />
          <div className="h-11 w-80 bg-zinc-800/60 rounded-xl mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-64 bg-zinc-800/40 rounded mx-auto animate-pulse" />
        </div>
        <div className="relative h-[460px] sm:h-[520px] flex items-center justify-center mb-14">
          <div className="w-[194px] h-[400px] rounded-[40px] bg-zinc-800/60 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/40 rounded-2xl overflow-hidden">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="bg-zinc-900 px-6 py-5 text-center">
              <div className="h-8 w-14 bg-zinc-800/70 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-3 w-12 bg-zinc-800/40 rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main export ───────────────────────────────────────────────── */

export function CinemaShowcase({ products }: { products: Product[] }) {
  if (products.length < 8) return null;

  const phoneProducts = products.slice(0, 5);
  const floatProducts = products.slice(5, 11);

  /* card layout configs ── right/left are PHYSICAL sides (not logical RTL) */
  const CARDS = [
    /* right side ─────────────────────────── */
    {
      wrapClass: "hidden sm:block absolute top-8 right-4 sm:right-8 md:right-14 lg:right-24 xl:right-36",
      floatY: [0, -15, 0], dur: 3.3, delay: 0.1, deg: 4,
      usage: USAGE[0],
    },
    {
      wrapClass: "hidden lg:block absolute bottom-8 right-4 lg:right-20 xl:right-36",
      floatY: [0, -10, 0], dur: 4.0, delay: 0.9, deg: -3,
      usage: USAGE[2],
    },
    {
      wrapClass: "hidden xl:block absolute top-1/2 -translate-y-1/2 right-2 xl:right-12",
      floatY: [0, 13, 0], dur: 3.7, delay: 0.5, deg: 2,
      usage: USAGE[1],
    },
    /* left side ──────────────────────────── */
    {
      wrapClass: "hidden sm:block absolute top-8 left-4 sm:left-8 md:left-14 lg:left-24 xl:left-36",
      floatY: [0, 15, 0], dur: 3.6, delay: 0.3, deg: -4,
      usage: USAGE[3],
    },
    {
      wrapClass: "hidden lg:block absolute bottom-8 left-4 lg:left-20 xl:left-36",
      floatY: [0, 11, 0], dur: 4.2, delay: 1.1, deg: 3,
      usage: USAGE[4],
    },
    {
      wrapClass: "hidden xl:block absolute top-1/2 -translate-y-1/2 left-2 xl:left-12",
      floatY: [0, -12, 0], dur: 3.9, delay: 0.7, deg: -2,
      usage: USAGE[5],
    },
  ];

  return (
    <section className="relative bg-zinc-950 py-20 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-violet-500/8 blur-[90px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest border border-brand-800/50 bg-brand-950/40 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            تجربه‌ی واقعی
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
            برای هر لحظه از زندگی
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            از صبح تا شب، از کار تا تفریح<br />لوازم جانبی که زندگیت رو کامل می‌کنن
          </p>
        </motion.div>

        {/* Showcase */}
        <div className="relative h-[460px] sm:h-[520px] flex items-center justify-center mb-14">
          {CARDS.map((cfg, i) =>
            floatProducts[i] ? (
              <FloatingCard
                key={floatProducts[i].id}
                product={floatProducts[i]}
                {...cfg}
              />
            ) : null
          )}
          <PhoneMockup products={phoneProducts} />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/40 rounded-2xl overflow-hidden mb-10"
        >
          {STATS.map((s, i) => (
            <div key={i} className="bg-zinc-900/80 px-4 py-5 sm:px-6 text-center">
              <p className="text-2xl sm:text-3xl font-black text-white mb-1 tabular-nums">{s.value}</p>
              <p className="text-xs text-zinc-500 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Usage scenarios */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2.5"
        >
          {SCENARIOS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 * i }}
              className={`flex items-center gap-2 bg-gradient-to-r ${s.from} ${s.to} rounded-full px-4 py-2 shadow-lg shadow-black/40`}
            >
              <span className="text-sm">{s.emoji}</span>
              <span className="text-xs font-bold text-white">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
