"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2, ShoppingBag, User, Phone, MapPin, MessageSquare,
  ArrowRight, Package, Shield, Truck, ClipboardCopy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { formatPrice, truncate } from "@/lib/utils";

const schema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
  phone: z.string().regex(/^(\+98|0)?9[0-9]{9}$/, "شماره موبایل معتبر نیست"),
  address: z.string().min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function CheckoutClient() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: string; trackingCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const totalPrice = getTotalPrice();

  const onSubmit = async (data: FormData) => {
    if (!items.length) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setOrderResult({ id: result.id, trackingCode: result.trackingCode });
        clearCart();
      } else {
        setError(result.error || "خطا در ثبت سفارش");
      }
    } catch {
      setError("خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyTracking = () => {
    if (orderResult?.trackingCode) {
      navigator.clipboard.writeText(orderResult.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Empty cart
  if (!items.length && !orderResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] pt-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="h-9 w-9 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold mb-2">سبد خرید خالی است</h2>
          <p className="text-muted-foreground mb-7 text-sm">ابتدا محصولی به سبد خرید اضافه کنید</p>
          <Button asChild variant="brand" size="lg"><Link href="/products">مشاهده محصولات</Link></Button>
        </div>
      </div>
    );
  }

  // Success
  if (orderResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] pt-16 px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: "spring" }}
          className="text-center max-w-md w-full">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
            className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </motion.div>

          <h2 className="text-3xl font-black mb-2">سفارش ثبت شد! 🎉</h2>
          <p className="text-muted-foreground mb-7 leading-relaxed text-sm">
            سفارش شما با موفقیت ثبت شد. اطلاعات سفارش برای مدیر ارسال شد.
            تیم ما در اسرع وقت با شما تماس می‌گیرد.
          </p>

          {/* Tracking code card */}
          <div className="bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-950/30 dark:to-violet-950/20 border border-brand-200 dark:border-brand-800 rounded-2xl p-6 mb-7">
            <p className="text-xs text-muted-foreground mb-2">کد پیگیری سفارش شما</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl font-black text-brand-700 dark:text-brand-400 tracking-widest font-mono">
                {orderResult.trackingCode}
              </code>
              <button onClick={copyTracking}
                className="flex items-center justify-center h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 hover:bg-brand-200 dark:hover:bg-brand-800/40 transition-colors">
                {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">این کد را برای پیگیری سفارش نگه‌داری کنید</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="brand" size="lg" className="flex-1"><Link href="/products">ادامه خرید</Link></Button>
            <Button asChild variant="outline" size="lg" className="flex-1"><Link href="/">صفحه اصلی</Link></Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/cart" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <ArrowRight className="h-4 w-4" />سبد خرید
        </Link>
        <span>›</span>
        <span className="text-foreground font-medium">تسویه حساب</span>
      </nav>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-10">
        {[{ n: "۱", t: "سبد خرید", done: true }, { n: "۲", t: "اطلاعات ارسال", active: true }, { n: "۳", t: "تأیید سفارش", done: false }].map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${s.done ? "bg-brand-600 text-white" : s.active ? "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/40" : "bg-muted text-muted-foreground"}`}>
                {s.done ? <Check className="h-4 w-4" /> : s.n}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${s.active ? "text-foreground" : "text-muted-foreground"}`}>{s.t}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${s.done ? "bg-brand-600" : "bg-border"}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-brand-600" />
              اطلاعات تحویل
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">نام *</Label>
                <Input id="firstName" placeholder="نام" {...register("firstName")} className={errors.firstName ? "border-destructive" : ""} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">نام خانوادگی *</Label>
                <Input id="lastName" placeholder="نام خانوادگی" {...register("lastName")} className={errors.lastName ? "border-destructive" : ""} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />شماره موبایل *
              </Label>
              <Input id="phone" type="tel" placeholder="09123456789" dir="ltr" {...register("phone")}
                className={`text-right ${errors.phone ? "border-destructive" : ""}`} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="address" className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />آدرس کامل *
              </Label>
              <Textarea id="address" placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد..." rows={3} {...register("address")}
                className={errors.address ? "border-destructive" : ""} />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />توضیحات (اختیاری)
              </Label>
              <Textarea id="notes" placeholder="زمان تحویل، نکات خاص ارسال..." rows={2} {...register("notes")} />
            </div>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-sm text-destructive">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" variant="brand" size="xl" loading={submitting} className="w-full lg:hidden shadow-xl shadow-brand-600/20 font-bold text-base">
            ثبت سفارش
          </Button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
              <Package className="h-5 w-5 text-brand-600" />
              سبد خرید ({items.reduce((s, i) => s + i.quantity, 0)} محصول)
            </h2>

            <div className="max-h-56 overflow-y-auto scrollbar-hide space-y-2.5 mb-5">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{truncate(item.product.name, 30)}</p>
                    <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-brand-600 shrink-0">{formatPrice(item.product.sellingPrice * item.quantity)}</p>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold">جمع کل:</span>
              <span className="text-xl font-black text-brand-600">{formatPrice(totalPrice)}</span>
            </div>

            <Button onClick={handleSubmit(onSubmit)} variant="brand" size="xl" loading={submitting}
              className="w-full hidden lg:flex shadow-xl shadow-brand-600/20 font-bold text-base">
              ثبت سفارش
            </Button>

            <div className="mt-5 pt-4 border-t border-border space-y-2.5">
              {[
                { icon: Shield, text: "پرداخت امن — بدون نگرانی" },
                { icon: Truck, text: "ارسال ظرف ۱–۳ روز کاری" },
                { icon: Package, text: "بسته‌بندی استاندارد و مطمئن" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-brand-600" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
