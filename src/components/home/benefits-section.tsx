"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, HeadphonesIcon, Zap, Award } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "ضمانت اصالت کالا",
    description: "تمامی محصولات دارای ضمانت‌نامه معتبر هستند",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    description: "تحویل سریع به سراسر ایران",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/40",
  },
  {
    icon: RotateCcw,
    title: "مرجوعی ۷ روزه",
    description: "در صورت عدم رضایت کالا را برگردانید",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
  },
  {
    icon: HeadphonesIcon,
    title: "پشتیبانی ۲۴/۷",
    description: "تیم پشتیبانی همیشه در کنار شماست",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/40",
  },
  {
    icon: Zap,
    title: "بهترین قیمت",
    description: "قیمت‌های رقابتی و تضمینی",
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
  },
  {
    icon: Award,
    title: "کیفیت تضمینی",
    description: "محصولات از برندهای معتبر بین‌المللی",
    color: "text-brand-500",
    bg: "bg-brand-50 dark:bg-brand-950/40",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-brand-600 mb-2">چرا ما؟</p>
          <h2 className="text-3xl font-bold mb-4">مزایای خرید از ایوِیز موبایل</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            ما متعهد به ارائه بهترین تجربه خرید آنلاین برای شما هستیم
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 bg-card rounded-2xl border border-border hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`inline-flex p-3 rounded-xl ${benefit.bg} mb-4`}>
                <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
