"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Search, Menu, X, Smartphone,
  Moon, Sun, ChevronDown, ArrowLeft, Zap, Package, User, Heart,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";

const TOP_CATEGORIES = CATEGORY_ORDER.slice(0, 8);

interface SearchResult {
  name: string;
  slug: string;
  brand: string;
  imageUrl: string;
  sellingPrice: number;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const items = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem("announcement-v1") === "1";
    setAnnouncementVisible(!dismissed);
    fetch("/api/auth/me").then((r) => r.ok ? r.json() : null).then((d) => d && setUser(d)).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
    closeSearch();
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (searchOverlayRef.current && !searchOverlayRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setSearching(false);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 60);
  };

  const dismissAnnouncement = () => {
    setAnnouncementVisible(false);
    localStorage.setItem("announcement-v1", "1");
  };

  const handleQueryChange = useCallback((v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.length < 2) { setResults([]); setSearching(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(v)}&pageSize=6`);
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 280);
  }, []);

  const doSearch = () => {
    if (!query.trim()) return;
    closeSearch();
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const goToProduct = (slug: string) => {
    closeSearch();
    router.push(`/products/${slug}`);
  };

  return (
    <>
      {/* Announcement bar */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-50 bg-brand-600 overflow-hidden"
          >
            <div className="relative mx-auto max-w-7xl px-12 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm text-white font-medium">
              <Zap className="h-3.5 w-3.5 shrink-0 fill-white/80" />
              <span>ارسال رایگان برای خریدهای بالای <strong>۵۰۰ هزار تومان</strong> به سراسر کشور</span>
              <button onClick={dismissAnnouncement}
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-2xl border-b border-border shadow-sm"
          : "bg-background/80 backdrop-blur-xl border-b border-border/0"
      )}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[60px] items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform">
                <Smartphone className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-black tracking-tight hidden sm:block">
                ایوِیز<span className="text-brand-600">موبایل</span>
              </span>
            </Link>

            {/* Desktop nav center */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              <Link href="/" className={cn(
                "px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === "/" ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )}>خانه</Link>

              <Link href="/products" className={cn(
                "px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === "/products" ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50" : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )}>همه محصولات</Link>

              {/* Categories dropdown */}
              <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                <button className={cn(
                  "flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname.startsWith("/categories")
                    ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )}>
                  دسته‌بندی‌ها
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", catOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 overflow-hidden"
                    >
                      <div className="p-2 grid grid-cols-1">
                        {TOP_CATEGORIES.map((cat) => {
                          const meta = CATEGORY_META[cat];
                          return (
                            <Link key={cat} href={`/categories/${encodeURIComponent(cat)}`}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent transition-colors group">
                              <div className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-sm shrink-0",
                                meta?.color ?? "from-gray-500 to-gray-700"
                              )}>
                                {meta?.emoji}
                              </div>
                              <span className="text-sm font-medium flex-1">{cat}</span>
                              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          );
                        })}
                      </div>
                      <div className="border-t border-border p-2">
                        <Link href="/products"
                          className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-xl transition-colors">
                          <Package className="h-4 w-4" />
                          همه محصولات
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              {/* Search button */}
              <button onClick={openSearch}
                className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-all border border-border/60 hover:border-border">
                <Search className="h-3.5 w-3.5" />
                <span className="hidden md:block text-xs opacity-70">جستجو...</span>
              </button>
              <Button variant="ghost" size="icon" onClick={openSearch} className="sm:hidden h-9 w-9 text-muted-foreground">
                <Search className="h-4.5 w-4.5" />
              </Button>

              {/* Theme toggle */}
              {mounted && (
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              {/* User / Login */}
              {mounted && (
                user ? (
                  <Link href={user.role === "ADMIN" ? "/admin" : "/account"}
                    className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-all border border-border/60 hover:border-border">
                    <User className="h-3.5 w-3.5" />
                    <span className="hidden md:block text-xs max-w-[80px] truncate">{user.name}</span>
                  </Link>
                ) : (
                  <Link href="/login"
                    className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-all border border-border/60 hover:border-border">
                    <User className="h-3.5 w-3.5" />
                    <span className="hidden md:block text-xs">ورود</span>
                  </Link>
                )
              )}

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <AnimatePresence>
                    {wishlistItems.length > 0 && (
                      <motion.span key="wbadge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] px-0.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none">
                        {wishlistItems.length > 99 ? "99+" : wishlistItems.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
                  <ShoppingCart className="h-4.5 w-4.5" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span key="badge"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] px-0.5 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white leading-none">
                        {totalItems > 99 ? "99+" : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Link>

              {/* Mobile menu */}
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 text-muted-foreground"
                onClick={() => setMobileOpen(!mobileOpen)}>
                <AnimatePresence mode="wait">
                  {mobileOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="h-4.5 w-4.5" /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="h-4.5 w-4.5" /></motion.div>
                  }
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="lg:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-4 py-3 space-y-0.5">
                <Link href="/" className={cn("flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === "/" ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50" : "text-muted-foreground hover:bg-accent")}>
                  خانه
                </Link>
                <Link href="/products" className={cn("flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === "/products" ? "text-brand-600 bg-brand-50 dark:bg-brand-950/50" : "text-muted-foreground hover:bg-accent")}>
                  همه محصولات
                </Link>
                {user ? (
                  <Link href={user.role === "ADMIN" ? "/admin" : "/account"} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
                    <User className="h-4 w-4" /> حساب کاربری ({user.name})
                  </Link>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors">
                    <User className="h-4 w-4" /> ورود / ثبت‌نام
                  </Link>
                )}

                <div className="pt-3">
                  <p className="px-3 pb-2 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">دسته‌بندی‌ها</p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {TOP_CATEGORIES.map((cat) => (
                      <Link key={cat} href={`/categories/${encodeURIComponent(cat)}`}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm hover:bg-accent transition-colors">
                        <span className="text-base">{CATEGORY_META[cat]?.emoji}</span>
                        <span className="truncate text-muted-foreground">{cat}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-screen search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          >
            <div className="flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                ref={searchOverlayRef}
                initial={{ opacity: 0, y: -20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl shadow-black/25 overflow-hidden"
              >
                {/* Search input */}
                <form onSubmit={(e) => { e.preventDefault(); doSearch(); }}
                  className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                  {searching
                    ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-brand-600 border-t-transparent rounded-full shrink-0" />
                    : <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  }
                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="جستجو در ۴۸۰۰ محصول..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 font-medium"
                    autoComplete="off"
                  />
                  <button type="button" onClick={closeSearch}
                    className="text-xs text-muted-foreground border border-border rounded-md px-1.5 py-1 font-mono hover:bg-accent transition-colors">
                    Esc
                  </button>
                </form>

                {/* Product results */}
                {results.length > 0 && (
                  <div className="p-2 max-h-[55vh] overflow-y-auto">
                    <p className="px-3 py-1 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                      نتایج جستجو
                    </p>
                    {results.map((r) => (
                      <button key={r.slug} onClick={() => goToProduct(r.slug)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors text-right">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted border border-border/50 shrink-0">
                          <Image src={r.imageUrl} alt={r.name} fill className="object-contain p-1" sizes="40px"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.brand}</p>
                        </div>
                        <span className="text-xs font-bold text-brand-600 shrink-0 whitespace-nowrap">
                          {formatPrice(r.sellingPrice)}
                        </span>
                      </button>
                    ))}
                    <button onClick={doSearch}
                      className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-dashed border-brand-200 dark:border-brand-800 transition-colors">
                      مشاهده همه نتایج «{query}»
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {!searching && query.length >= 2 && results.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-3xl mb-3">🔍</p>
                    <p className="text-sm text-muted-foreground">نتیجه‌ای برای «{query}» یافت نشد</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">عبارت دیگری امتحان کنید</p>
                  </div>
                )}

                {!query && (
                  <div className="p-3">
                    <p className="px-2 pb-2 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                      دسته‌های محبوب
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {TOP_CATEGORIES.slice(0, 6).map((cat) => (
                        <Link key={cat} href={`/categories/${encodeURIComponent(cat)}`} onClick={closeSearch}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-accent transition-colors text-center">
                          <span className="text-xl">{CATEGORY_META[cat]?.emoji}</span>
                          <span className="text-xs text-muted-foreground leading-tight">{cat}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
