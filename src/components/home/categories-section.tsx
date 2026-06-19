"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";

interface CategoryWithCount {
  category: string;
  count: number;
}

export function CategoriesSection({ categories }: { categories: CategoryWithCount[] }) {
  const sorted = CATEGORY_ORDER
    .map((name) => ({
      name,
      count: categories.find((c) => c.category === name)?.count ?? 0,
      meta: CATEGORY_META[name],
    }))
    .filter((c) => c.count > 0);

  return (
    <section className="py-20 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">دسته‌بندی‌ها</p>
            <h2 className="text-3xl font-black">خرید بر اساس نوع محصول</h2>
          </div>
          <Link href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            همه محصولات
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {sorted.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Link
                href={`/categories/${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3.5 p-4 sm:p-5 bg-card border border-border rounded-2xl hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.meta?.color ?? "from-gray-500 to-gray-700"} text-3xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {cat.meta?.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight mb-0.5">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.count.toLocaleString("fa-IR")} محصول</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
