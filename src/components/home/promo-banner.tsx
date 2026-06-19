"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Main promo */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 p-8 md:p-10 min-h-[220px] flex flex-col justify-between">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 mb-4">
                <Zap className="h-3.5 w-3.5 fill-current" />
                پیشنهاد ویژه
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">بهترین کابل‌ها</h3>
              <p className="text-white/75 text-sm mb-6">بیش از ۱۳۵۸ کابل شارژ و دیتا از برندهای معتبر</p>
              <Button asChild className="bg-white text-brand-700 hover:bg-white/90 font-bold shadow-lg">
                <Link href={`/categories/${encodeURIComponent("کابل‌ها")}`}>
                  مشاهده کابل‌ها
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Two sub-promos */}
          <div className="flex flex-col gap-5">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 flex-1 flex items-center justify-between min-h-[100px]">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="relative">
                <h4 className="text-lg font-black text-white mb-1">شارژرهای فست</h4>
                <p className="text-white/70 text-xs">شارژ سریع تا ۱۰۰W</p>
              </div>
              <Link href={`/categories/${encodeURIComponent("شارژرها")}`}
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors shrink-0 ml-2">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-6 flex-1 flex items-center justify-between min-h-[100px]">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="relative">
                <h4 className="text-lg font-black text-white mb-1">هندزفری بی‌سیم</h4>
                <p className="text-white/70 text-xs">بیش از ۶۰۰ مدل</p>
              </div>
              <Link href={`/categories/${encodeURIComponent("هندزفری و هدفون")}`}
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors shrink-0 ml-2">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
