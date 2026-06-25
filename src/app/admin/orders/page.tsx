export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار تأیید", CONFIRMED: "تأیید شده", PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال شده", DELIVERED: "تحویل داده شده", CANCELLED: "لغو شده",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: { include: { product: { select: { name: true } } } } },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">
        سفارش‌ها <span className="text-muted-foreground text-base font-normal">({orders.length.toLocaleString("fa-IR")})</span>
      </h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono font-medium">{order.trackingCode}</p>
                <p className="text-sm text-muted-foreground">{order.firstName} {order.lastName} · {order.phone}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{order.address}</p>
              </div>
              <div className="text-left flex flex-col items-end gap-2">
                <p className="font-semibold">{order.totalAmount.toLocaleString("fa-IR")} هزار تومان</p>
                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
                <OrderStatusSelect orderId={order.id} status={order.status} labels={STATUS_LABELS} />
              </div>
            </div>
            <div className="text-sm text-muted-foreground border-t pt-3 space-y-1">
              {order.items.map((item) => (
                <p key={item.id}>{item.product.name} × {item.quantity} — {item.price.toLocaleString("fa-IR")} هزار تومان</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
