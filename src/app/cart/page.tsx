import type { Metadata } from "next";
import { CartClient } from "@/components/cart/cart-client";

export const metadata: Metadata = {
  title: "سبد خرید",
};

export default function CartPage() {
  return <CartClient />;
}
