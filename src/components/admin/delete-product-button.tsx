"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    setLoading(true);
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    router.refresh();
    setLoading(false);
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded-lg transition disabled:opacity-50">
      {loading ? "..." : "حذف"}
    </button>
  );
}
