import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "ثبت سفارش",
  CONFIRMED: "تأیید شده",
  PROCESSING: "آماده‌سازی",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل داده شده",
  CANCELLED: "لغو شده",
};

const STATUS_ICONS: Record<string, string> = {
  PENDING: "🧾",
  CONFIRMED: "✅",
  PROCESSING: "📦",
  SHIPPED: "🚚",
  DELIVERED: "🎉",
};

function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-red-500">
        <span>❌</span> سفارش لغو شده است
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
  const progressPct = currentIdx === 0 ? 0 : (currentIdx / (STATUS_STEPS.length - 1)) * 93;

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-start justify-between relative">
        <div className="absolute top-3.5 right-3.5 left-3.5 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
        <div className="absolute top-3.5 right-3.5 h-0.5 bg-green-500 z-0 transition-all duration-700" style={{ width: `${progressPct}%` }} />

        {STATUS_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                done ? "bg-green-500 border-green-500 text-white" : "bg-background border-gray-200 dark:border-gray-700"
              } ${active ? "ring-4 ring-green-500/20 shadow-lg" : ""}`}>
                {done ? (active ? STATUS_ICONS[step] : "✓") : <span className="text-[10px] text-muted-foreground">{i + 1}</span>}
              </div>
              <span className={`text-[10px] font-medium text-center leading-tight max-w-[48px] ${done ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                {STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { name: true, imageUrl: true } } } } },
  });

  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Profile card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-xl font-black shrink-0">
                {session.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-bold">{session.name}</h1>
                <p className="text-sm text-muted-foreground">{session.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t">
            {[
              { label: "کل سفارش‌ها", value: orders.length.toLocaleString("fa-IR") },
              { label: "در جریان", value: orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length.toLocaleString("fa-IR") },
              { label: "مجموع خرید", value: `${totalSpent.toLocaleString("fa-IR")} ت` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-black text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider px-1">سفارش‌های من</h2>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border p-12 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-medium mb-1">هنوز سفارشی ثبت نکرده‌اید</p>
            <p className="text-sm text-muted-foreground mb-6">اولین خرید خود را همین الان انجام دهید</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold">{order.trackingCode}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <p className="font-bold text-sm">{order.totalAmount.toLocaleString("fa-IR")} هزار تومان</p>
                </div>
                <div className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-xs text-muted-foreground">
                      • {item.product.name} × {item.quantity}
                    </p>
                  ))}
                </div>
                <OrderTimeline status={order.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
