"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={logout} className="text-sm text-muted-foreground hover:text-red-500 transition px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20">
      خروج
    </button>
  );
}
