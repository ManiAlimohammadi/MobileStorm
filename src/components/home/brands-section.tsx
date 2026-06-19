"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const topBrands = [
  { name: "Samsung", emoji: "📱", count: "147" },
  { name: "Apple", emoji: "🍎", count: "71" },
  { name: "Anker", emoji: "⚡", count: "55" },
  { name: "Ugreen", emoji: "🔌", count: "126" },
  { name: "Xiaomi", emoji: "📡", count: "96" },
  { name: "BASEUS", emoji: "🎯", count: "52" },
  { name: "Yesido", emoji: "🔋", count: "415" },
  { name: "JBQ", emoji: "🎵", count: "181" },
];

export function BrandsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-brand-600 mb-2">برندهای معتبر</p>
          <h2 className="text-3xl font-bold">خرید از بهترین برندها</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {topBrands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="flex flex-col items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {brand.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.count} محصول</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
