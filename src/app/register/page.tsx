"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/account");
      router.refresh();
    } catch {
      setError("خطای اتصال. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">ایوِیز موبایل</Link>
          <p className="text-muted-foreground mt-2 text-sm">ایجاد حساب کاربری جدید</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "نام و نام خانوادگی", type: "text", placeholder: "علی رضایی", dir: "rtl" },
              { key: "email", label: "ایمیل", type: "email", placeholder: "your@email.com", dir: "ltr" },
              { key: "phone", label: "شماره موبایل (اختیاری)", type: "tel", placeholder: "09123456789", dir: "ltr" },
              { key: "password", label: "رمز عبور", type: "password", placeholder: "حداقل ۶ کاراکتر", dir: "ltr" },
            ].map(({ key, label, type, placeholder, dir }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={update(key as keyof typeof form)}
                  className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder={placeholder}
                  dir={dir as "rtl" | "ltr"}
                  required={key !== "phone"}
                />
              </div>
            ))}

            {error && (
              <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition disabled:opacity-60"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            حساب دارید؟{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">وارد شوید</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
