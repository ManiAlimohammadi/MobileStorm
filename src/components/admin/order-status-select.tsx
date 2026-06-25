"use client";

import { useState } from "react";

export function OrderStatusSelect({ orderId, status, labels }: {
  orderId: string; status: string; labels: Record<string, string>;
}) {
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setSaving(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    setCurrent(newStatus);
    setSaving(false);
  }

  return (
    <select value={current} onChange={handleChange} disabled={saving}
      className="text-xs border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60">
      {Object.entries(labels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
