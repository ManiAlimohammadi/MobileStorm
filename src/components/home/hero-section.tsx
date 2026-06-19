"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "+۴۸۰۰", label: "محصول" },
  { value: "+۱۳۶", label: "برند" },
  { value: "۱۳", label: "دسته‌بندی" },
  { value: "۱۰۰٪", label: "تضمین اصالت" },
];

const badges = [
  { icon: ShieldCheck, text: "ضمانت اصالت" },
  { icon: Truck, text: "ارسال سریع" },
  { icon: RotateCcw, text: "مرجوعی ۷ روزه" },
  { icon: Zap, text: "بهترین قیمت" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.15),transparent)]" />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px"
        }} />

      {/* Ambient glows */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl dark:bg-brand-500/10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl dark:bg-violet-500/10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600/8 border border-brand-600/15 px-4 py-2 text-sm font-semibold text-brand-700 dark:text-brand-400 mb-7"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              بزرگ‌ترین مرجع لوازم جانبی موبایل
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black tracking-tight leading-[1.08] mb-6 text-balance"
            >
              لوازم جانبی
              <br />
              <span className="bg-gradient-to-l from-brand-600 via-violet-600 to-brand-500 bg-clip-text text-transparent">
                اصل و با کیفیت
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="text-[17px] text-muted-foreground mb-9 leading-relaxed max-w-md"
            >
              بیش از <strong className="text-foreground font-bold">۴۸۰۰ محصول</strong> از{" "}
              <strong className="text-foreground font-bold">۱۳۶ برند</strong> معتبر جهانی.
              از شارژر و کابل تا هندزفری، همه با{" "}
              <strong className="text-foreground font-bold">قیمت تضمینی</strong> و ارسال سریع.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <Button asChild variant="brand" size="xl" className="shadow-2xl shadow-brand-600/20 text-base font-bold group">
                <Link href="/products">
                  خرید همه محصولات
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="xl" className="bg-background hover:bg-accent border border-border text-foreground font-semibold text-base">
                <Link href={`/categories/${encodeURIComponent("کابل‌ها")}`}>
                  مشاهده کابل‌ها
                </Link>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="flex flex-wrap gap-2.5"
            >
              {badges.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 + i * 0.07 }}
                  className="flex items-center gap-2 rounded-xl bg-card border border-border px-3.5 py-2 text-sm font-medium shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-600" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Stats panel */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all"
                >
                  <p className="text-3xl font-black text-brand-600 mb-1 tabular-nums">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
