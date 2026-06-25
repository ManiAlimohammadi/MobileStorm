import type { Metadata } from "next";
import { WishlistClient } from "@/components/wishlist/wishlist-client";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها" };

export default function WishlistPage() {
  return <WishlistClient />;
}
