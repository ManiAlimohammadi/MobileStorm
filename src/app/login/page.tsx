"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [tab, setTab] = useState<"customer" | "seller">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push(data.role === "ADMIN" ? "/admin" : next);
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
          <p className="text-muted-foreground mt-2 text-sm">ورود به حساب کاربری</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {(["customer", "seller"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "customer" ? "مشتری" : "فروشنده"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder={tab === "seller" ? "admin@example.com" : "your@email.com"}
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition disabled:opacity-60"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          {tab === "customer" && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              حساب ندارید؟{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                ثبت‌نام کنید
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
