import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">داشبورد</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "کل محصولات", value: productCount.toLocaleString("fa-IR"), href: "/admin/products", color: "text-blue-600" },
          { label: "کل سفارش‌ها", value: orderCount.toLocaleString("fa-IR"), href: "/admin/orders", color: "text-green-600" },
          { label: "در انتظار تأیید", value: pendingCount.toLocaleString("fa-IR"), href: "/admin/orders", color: "text-yellow-600" },
        ].map(({ label, value, href, color }) => (
          <Link key={label} href={href} className="bg-white dark:bg-gray-900 rounded-2xl border p-5 hover:shadow-sm transition">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">آخرین سفارش‌ها</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">همه</Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-mono text-sm">{o.trackingCode}</p>
                <p className="text-xs text-muted-foreground">{o.firstName} {o.lastName}</p>
              </div>
              <p className="text-sm font-medium">{o.totalAmount.toLocaleString("fa-IR")} هزار تومان</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
