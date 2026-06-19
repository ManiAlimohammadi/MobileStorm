import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsClient } from "@/components/products/products-client";

export const metadata: Metadata = {
  title: "همه محصولات",
  description: "مشاهده و خرید بیش از ۴۸۰۰ لوازم جانبی موبایل از بهترین برندها",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
