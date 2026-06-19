import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "ایوِیز موبایل | لوازم جانبی موبایل",
    template: "%s | ایوِیز موبایل",
  },
  description:
    "خرید آنلاین بهترین لوازم جانبی موبایل با بهترین قیمت. شارژر، کابل، هندزفری، پاوربانک و هزاران محصول دیگر از برندهای معتبر جهانی.",
  keywords: [
    "لوازم جانبی موبایل",
    "خرید آنلاین",
    "شارژر",
    "کابل",
    "هندزفری",
    "پاوربانک",
    "Samsung",
    "Apple",
    "Anker",
    "Ugreen",
  ],
  authors: [{ name: "ایوِیز موبایل" }],
  creator: "ایوِیز موبایل",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "ایوِیز موبایل",
    title: "ایوِیز موبایل | لوازم جانبی موبایل",
    description: "خرید آنلاین بهترین لوازم جانبی موبایل با بهترین قیمت",
  },
  twitter: {
    card: "summary_large_image",
    title: "ایوِیز موبایل | لوازم جانبی موبایل",
    description: "خرید آنلاین بهترین لوازم جانبی موبایل با بهترین قیمت",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f14" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
