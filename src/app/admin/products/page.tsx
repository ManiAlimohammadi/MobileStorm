export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const total = await prisma.product.count();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">محصولات <span className="text-muted-foreground text-base font-normal">({total.toLocaleString("fa-IR")})</span></h1>
        <Link href="/admin/products/add" className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition">
          + افزودن محصول
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["تصویر", "نام محصول", "برند", "دسته‌بندی", "قیمت فروش", "موجودی", "عملیات"].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-contain rounded-lg border" />
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium line-clamp-2">{p.name}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 font-medium">{p.sellingPrice.toLocaleString("fa-IR")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock.toLocaleString("fa-IR")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DeleteProductButton id={p.id} />
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
