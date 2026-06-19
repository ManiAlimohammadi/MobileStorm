import Link from "next/link";
import { Smartphone, Mail, Phone, MapPin, Instagram, Send, Shield, Truck, RotateCcw, Headphones } from "lucide-react";
import { CATEGORY_ORDER, CATEGORY_META } from "@/lib/categories";

const TOP_CATS = CATEGORY_ORDER.slice(0, 6);

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Trust bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-border">
          {[
            { icon: Shield, title: "ضمانت اصالت", sub: "۱۰۰٪ کالای اصل" },
            { icon: Truck, title: "ارسال سریع", sub: "۱ تا ۳ روز کاری" },
            { icon: RotateCcw, title: "مرجوعی ۷ روزه", sub: "بدون شرط و سؤال" },
            { icon: Headphones, title: "پشتیبانی ۲۴/۷", sub: "همیشه در دسترس" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/50">
                <Icon className="h-4.5 w-4.5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-md shadow-brand-600/20">
                <Smartphone className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-black">
                ایوِیز<span className="text-brand-600">موبایل</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              فروشگاه تخصصی لوازم جانبی موبایل با بیش از ۴۸۰۰ محصول از برندهای معتبر جهانی.
              کیفیت تضمینی، قیمت مناسب، ارسال سریع.
            </p>
            <div className="flex items-center gap-2">
              {[Instagram, Send].map((Icon, i) => (
                <a key={i} href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted hover:bg-brand-100 dark:hover:bg-brand-950/50 text-muted-foreground hover:text-brand-600 transition-all border border-border hover:border-brand-200 dark:hover:border-brand-800">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm mb-5 text-foreground">دسته‌بندی‌ها</h3>
            <ul className="space-y-2.5">
              {TOP_CATS.map((cat) => (
                <li key={cat}>
                  <Link href={`/categories/${encodeURIComponent(cat)}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-600 transition-colors group">
                    <span className="text-base group-hover:scale-110 transition-transform">
                      {CATEGORY_META[cat]?.emoji}
                    </span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-sm mb-5 text-foreground">دسترسی سریع</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "صفحه اصلی" },
                { href: "/products", label: "همه محصولات" },
                { href: "/products?featured=true", label: "محصولات ویژه" },
                { href: "/cart", label: "سبد خرید" },
                { href: "/checkout", label: "تسویه حساب" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-5 text-foreground">تماس با ما</h3>
            <ul className="space-y-3.5">
              {[
                { icon: Phone, text: "۰۲۱-۱۲۳۴۵۶۷۸" },
                { icon: Mail, text: "support@ewayz.ir" },
                { icon: MapPin, text: "تهران، ایران" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-brand-600 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© ۱۴۰۴ ایوِیز موبایل. تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">حریم خصوصی</a>
            <a href="#" className="hover:text-foreground transition-colors">قوانین و مقررات</a>
            <a href="#" className="hover:text-foreground transition-colors">راهنمای خرید</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
