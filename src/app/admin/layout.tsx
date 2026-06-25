import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login?next=/admin");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-primary text-sm">پنل فروشنده</Link>
            <nav className="flex items-center gap-4">
              {[
                { href: "/admin/products", label: "محصولات" },
                { href: "/admin/products/add", label: "+ محصول" },
                { href: "/admin/orders", label: "سفارش‌ها" },
                { href: "/admin/customers", label: "مشتریان" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{session.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
