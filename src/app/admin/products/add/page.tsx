"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "کابل‌ها","شارژرها","هندزفری و هدفون","اسپیکر","پاوربانک",
  "قاب و کاور","محافظ صفحه","ساعت و مچ‌بند","هاب و تبدیل",
  "پایه و نگهدارنده","باتری","حافظه و ذخیره‌سازی","لوازم جانبی",
];

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    productId: "", name: "", brand: "", category: CATEGORIES[0],
    purchasePrice: "", sellingPrice: "", imageUrl: "", stock: "100", featured: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          purchasePrice: parseFloat(form.purchasePrice),
          sellingPrice: parseFloat(form.sellingPrice),
          stock: parseInt(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(true);
      setForm({ productId: "", name: "", brand: "", category: CATEGORIES[0], purchasePrice: "", sellingPrice: "", imageUrl: "", stock: "100", featured: false });
    } catch {
      setError("خطای اتصال");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">افزودن محصول جدید</h1>
        <button onClick={() => router.push("/admin/products")} className="text-sm text-muted-foreground hover:text-foreground">
          → لیست محصولات
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="شناسه محصول" value={form.productId} onChange={update("productId")} placeholder="مثلاً 148315" dir="ltr" required />
            <Field label="برند" value={form.brand} onChange={update("brand")} placeholder="Samsung" required />
          </div>
          <Field label="نام کامل محصول" value={form.name} onChange={update("name")} placeholder="کابل شارژ سریع..." required />

          <div>
            <label className="block text-sm font-medium mb-1.5">دسته‌بندی</label>
            <select value={form.category} onChange={update("category")}
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="قیمت خرید (هزار تومان)" value={form.purchasePrice} onChange={update("purchasePrice")} type="number" placeholder="340" dir="ltr" required />
            <Field label="قیمت فروش (هزار تومان)" value={form.sellingPrice} onChange={update("sellingPrice")} type="number" placeholder="459" dir="ltr" required />
            <Field label="موجودی" value={form.stock} onChange={update("stock")} type="number" placeholder="100" dir="ltr" required />
          </div>

          <Field label="لینک تصویر" value={form.imageUrl} onChange={update("imageUrl")} type="url" placeholder="https://..." dir="ltr" required />

          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden border w-32 h-32">
              <img src={form.imageUrl} alt="preview" className="w-full h-full object-contain p-2" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={update("featured")} className="w-4 h-4 rounded" />
            <span className="text-sm">محصول ویژه (نمایش در صفحه اصلی)</span>
          </label>

          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-600 text-sm bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-lg">محصول با موفقیت اضافه شد ✓</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition disabled:opacity-60">
            {loading ? "در حال ذخیره..." : "افزودن محصول"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, dir, required }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; dir?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} dir={dir as "ltr" | "rtl" | undefined} required={required}
        className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
    </div>
  );
}
