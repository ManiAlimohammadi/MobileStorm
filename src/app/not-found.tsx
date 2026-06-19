import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <p className="text-8xl font-black text-brand-600/20 mb-6">۴۰۴</p>
      <h2 className="text-3xl font-bold mb-3">صفحه یافت نشد</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        صفحه‌ای که دنبالش می‌گردید وجود ندارد یا حذف شده است.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="brand" size="lg">
          <Link href="/">صفحه اصلی</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">محصولات</Link>
        </Button>
      </div>
    </div>
  );
}
