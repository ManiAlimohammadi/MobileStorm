"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "کابل‌ها","شارژرها","هندزفری و هدفون","اسپیکر","پاوربانک",
  "قاب و کاور","محافظ صفحه","ساعت و مچ‌بند","هاب و تبدیل",
  "پایه و نگهدارنده","باتری","حافظه و ذخیره‌سازی","لوازم جانبی",
];

type ProductRow = {
  productId: string; name: string; brand: string; category: string;
  purchasePrice: number; sellingPrice: number; imageUrl: string; stock: number; featured: boolean;
};

function ManualForm() {
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
  );
}

function CsvImport() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) { setParseErrors(["فایل خالی است"]); return; }

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/["']/g, ""));
    const REQUIRED = ["productid", "name", "brand", "category", "purchaseprice", "sellingprice", "imageurl"];
    const missing = REQUIRED.filter((r) => !header.includes(r));
    if (missing.length) { setParseErrors([`ستون‌های مفقود: ${missing.join(", ")}`]); return; }

    const parsed: ProductRow[] = [];
    const errs: string[] = [];

    lines.slice(1).forEach((line, i) => {
      if (!line.trim()) return;
      const vals = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
      const get = (key: string) => vals[header.indexOf(key)] ?? "";
      const row: ProductRow = {
        productId: get("productid"),
        name: get("name"),
        brand: get("brand"),
        category: get("category") || CATEGORIES[0],
        purchasePrice: parseFloat(get("purchaseprice")) || 0,
        sellingPrice: parseFloat(get("sellingprice")) || 0,
        imageUrl: get("imageurl"),
        stock: parseInt(get("stock")) || 100,
        featured: get("featured") === "true" || get("featured") === "1",
      };
      if (!row.productId || !row.name || !row.sellingPrice) {
        errs.push(`ردیف ${i + 2}: اطلاعات ناقص`);
      } else {
        parsed.push(row);
      }
    });

    setRows(parsed);
    setParseErrors(errs);
    setDone(0);
    setFailed(0);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => parseCSV(ev.target?.result as string);
    reader.readAsText(file, "utf-8");
  }

  async function handleImport() {
    if (!rows.length) return;
    setImporting(true);
    setDone(0); setFailed(0);

    let d = 0, f = 0;
    for (const row of rows) {
      try {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
        if (res.ok) d++; else f++;
      } catch { f++; }
      setDone(d); setFailed(f);
    }
    setImporting(false);
    setRows([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  const progress = rows.length ? Math.round(((done + failed) / rows.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
        <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">فرمت فایل CSV</p>
        <code className="text-xs text-blue-700 dark:text-blue-400 block leading-loose font-mono whitespace-nowrap overflow-x-auto">
          productId,name,brand,category,purchasePrice,sellingPrice,imageUrl,stock,featured
        </code>
        <code className="text-xs text-blue-600 dark:text-blue-500 block leading-loose font-mono whitespace-nowrap overflow-x-auto">
          148315,کابل شارژ سریع Samsung,Samsung,کابل‌ها,340,459,https://example.com/img.jpg,100,false
        </code>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">انتخاب فایل CSV</label>
        <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile}
          className="block w-full text-sm text-muted-foreground file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition cursor-pointer" />
      </div>

      {parseErrors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 rounded-xl p-3">
          {parseErrors.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
        </div>
      )}

      {rows.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">{rows.length.toLocaleString("fa-IR")} محصول آماده برای بارگذاری</p>
          <div className="border rounded-xl overflow-hidden max-h-56 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {["شناسه", "نام", "برند", "قیمت فروش"].map((h) => (
                    <th key={h} className="px-3 py-2 text-right font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-3 py-1.5 font-mono">{r.productId}</td>
                    <td className="px-3 py-1.5 max-w-[200px] truncate">{r.name}</td>
                    <td className="px-3 py-1.5">{r.brand}</td>
                    <td className="px-3 py-1.5">{r.sellingPrice.toLocaleString("fa-IR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {importing && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>در حال بارگذاری...</span>
            <span>{done + failed} از {rows.length}</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {!importing && (done > 0 || failed > 0) && (
        <p className="text-sm bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-lg text-green-700">
          {done.toLocaleString("fa-IR")} محصول بارگذاری شد{failed > 0 && ` · ${failed.toLocaleString("fa-IR")} ناموفق`} ✓
        </p>
      )}

      <button onClick={handleImport} disabled={!rows.length || importing}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition disabled:opacity-60">
        {importing
          ? `در حال بارگذاری... (${done}/${rows.length})`
          : rows.length > 0 ? `بارگذاری ${rows.length.toLocaleString("fa-IR")} محصول` : "ابتدا فایل CSV انتخاب کنید"}
      </button>
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
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        dir={dir as "ltr" | "rtl" | undefined} required={required}
        className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
    </div>
  );
}

export default function AddProductPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"manual" | "csv">("manual");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">افزودن محصول</h1>
        <button onClick={() => router.push("/admin/products")} className="text-sm text-muted-foreground hover:text-foreground">
          → لیست محصولات
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border p-6">
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {([["manual", "افزودن دستی"], ["csv", "آپلود CSV"]] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "manual" ? <ManualForm /> : <CsvImport />}
      </div>
    </div>
  );
}
