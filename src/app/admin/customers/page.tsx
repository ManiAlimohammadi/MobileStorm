export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, phone: true, createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">
        مشتریان <span className="text-muted-foreground text-base font-normal">({customers.length.toLocaleString("fa-IR")})</span>
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["نام", "ایمیل", "موبایل", "تعداد سفارش", "تاریخ ثبت‌نام"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">هنوز مشتری‌ای ثبت‌نام نکرده است</td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c._count.orders > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>
                      {c._count.orders.toLocaleString("fa-IR")} سفارش
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
