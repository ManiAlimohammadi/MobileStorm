import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "تسویه حساب",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
