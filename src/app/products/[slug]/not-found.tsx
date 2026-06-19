import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, Package } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center pt-16">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
        <Package className="h-9 w-9 text-muted-foreground/40" />
      </div>
      <h1 className="text-2xl font-bold mb-2">محصول یافت نشد</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-sm">
        این محصول وجود ندارد یا لینک آن تغییر کرده. از میان هزاران محصول دیگر انتخاب کنید.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="brand" size="lg">
          <Link href="/products">
            <Search className="h-4 w-4" />
            جستجو در محصولات
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <Home className="h-4 w-4" />
            صفحه اصلی
          </Link>
        </Button>
      </div>
    </div>
  );
}
