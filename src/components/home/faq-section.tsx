"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "آیا همه محصولات اصل هستند?", a: "بله، ایوِیز موبایل با تامین‌کنندگان مستقیم همکاری می‌کند. تمامی محصولات دارای ضمانت اصالت و گارانتی معتبر هستند." },
  { q: "مدت زمان ارسال چقدر است?", a: "سفارش‌ها معمولاً ظرف ۱ تا ۳ روز کاری پس از تأیید، از طریق پست پیشتاز یا تیپاکس به دست شما می‌رسد. برای تهران امکان ارسال همان‌روز نیز وجود دارد." },
  { q: "آیا امکان مرجوع کردن کالا وجود دارد?", a: "بله، شما ۷ روز فرصت مرجوعی دارید. کافی است با تیم پشتیبانی ما تماس بگیرید. شرط مرجوعی: کالا نباید استفاده شده یا پلمب آن باز شده باشد." },
  { q: "نحوه ثبت سفارش چگونه است?", a: "محصول مورد نظر را به سبد خرید اضافه کنید، اطلاعات ارسال را وارد نمایید و سفارش خود را ثبت کنید. کد پیگیری برای شما صادر خواهد شد." },
  { q: "آیا شارژر دیواری با بسامد ۵۰ و ۶۰ هرتز کار می‌کند?", a: "بله، اکثر شارژرهای موجود در سایت دارای ورودی ۱۰۰–۲۴۰V هستند و با برق تمام کشورها سازگارند." },
  { q: "آیا ضمانت‌نامه بین‌المللی دارند?", a: "ضمانت‌نامه محصولات داخل ایران معتبر است. برای جزئیات بیشتر، توضیحات هر محصول را بررسی کنید." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-sm font-semibold text-brand-600 mb-2 tracking-wide uppercase">سؤالات متداول</p>
          <h2 className="text-3xl font-bold">پاسخ به سؤالات شما</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-right hover:bg-accent/50 transition-colors">
                <span className="font-semibold text-sm">{faq.q}</span>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${open === i ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground"}`}>
                  {open === i ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
