"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-center"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <Mail className="h-7 w-7 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              خبرنامه ایوِیز موبایل
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              برای اطلاع از جدیدترین محصولات، تخفیف‌های ویژه و پیشنهادات شگفت‌انگیز
              عضو خبرنامه ما شوید.
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 text-white"
              >
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-lg font-medium">با موفقیت عضو شدید!</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/40 h-12 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  className="bg-white text-brand-600 hover:bg-white/90 font-semibold px-6 h-12 rounded-xl"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "عضویت"
                  )}
                </Button>
              </form>
            )}

            {status === "error" && (
              <p className="text-red-300 text-sm mt-3">
                خطایی رخ داد. لطفاً دوباره تلاش کنید.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
