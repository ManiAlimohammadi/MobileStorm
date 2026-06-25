import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/logout-button";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار تأیید",
  CONFIRMED: "تأیید شده",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل داده شده",
  CANCELLED: "لغو شده",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  SHIPPED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { name: true, imageUrl: true } } } } },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold">حساب کاربری</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{session.name} · {session.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Orders */}
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">سفارش‌های من</h2>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border p-12 text-center text-muted-foreground">
            <p className="text-4xl mb-3">📦</p>
            <p>هنوز سفارشی ثبت نکرده‌اید.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm font-medium">{order.trackingCode}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </p>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">مبلغ کل</span>
                  <span className="font-semibold text-sm">
                    {order.totalAmount.toLocaleString("fa-IR")} هزار تومان
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
