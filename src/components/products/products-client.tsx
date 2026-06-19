"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronRight, ChevronLeft } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import type { Product, ProductsApiResponse } from "@/types";

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price_asc", label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
  { value: "name_asc", label: "الفبایی" },
];

interface ProductsClientProps {
  defaultCategory?: string;
  hideHeader?: boolean;
}

export function ProductsClient({ defaultCategory, hideHeader }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<{ brand: string; count: number }[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || "";
  const category = defaultCategory || searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const featured = searchParams.get("featured") === "true";

  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    if (defaultCategory) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
      }
      router.push(`/categories/${encodeURIComponent(defaultCategory)}?${params.toString()}`, { scroll: false });
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, defaultCategory]);

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`?${params.toString()}`, { scroll: true });
  };

  useEffect(() => {
    fetch("/api/brands").then((r) => r.json()).then((d) => setBrands(d.slice(0, 40))).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    if (featured) params.set("featured", "true");
    params.set("pageSize", "24");

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data: ProductsApiResponse) => {
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [search, brand, category, sort, page, featured]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ search: value || null }), 400);
  };

  const clearFilters = () => {
    setSearchInput("");
    if (defaultCategory) router.push(`/categories/${encodeURIComponent(defaultCategory)}`, { scroll: false });
    else router.push("/products", { scroll: false });
  };

  const hasFilters = search || brand || featured;

  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${hideHeader ? "pt-6" : "pt-24"} pb-20`}>
      {!hideHeader && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1.5">همه محصولات</h1>
          <p className="text-muted-foreground text-sm">
            {loading ? "در حال بارگذاری..." : `${total.toLocaleString("fa-IR")} محصول`}
          </p>
        </div>
      )}

      {/* Category chips */}
      {!defaultCategory && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          <button onClick={() => updateParams({ category: null })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${!category ? "bg-brand-600 text-white shadow-md shadow-brand-600/20" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
            همه
          </button>
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <button key={cat} onClick={() => updateParams({ category: cat })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${category === cat ? "bg-brand-600 text-white shadow-md shadow-brand-600/20" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                <span>{meta?.emoji}</span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="جستجوی محصول..." className="pr-10" />
        </div>
        <Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant={filtersOpen ? "brand" : "outline"} onClick={() => setFiltersOpen(!filtersOpen)} className="sm:w-auto gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          برند
        </Button>
        {hasFilters && <Button variant="ghost" onClick={clearFilters} size="icon"><X className="h-4 w-4" /></Button>}
      </div>

      {/* Brand filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-card border border-border rounded-2xl p-5 mb-5">
              <h3 className="text-sm font-semibold mb-3">فیلتر بر اساس برند</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => updateParams({ brand: null })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!brand ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                  همه برندها
                </button>
                {brands.map((b) => (
                  <button key={b.brand} onClick={() => updateParams({ brand: b.brand })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${brand === b.brand ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                    {b.brand} <span className="opacity-60">({b.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {(hasFilters || category) && (
        <div className="flex flex-wrap gap-2 mb-5">
          {search && (
            <div className="flex items-center gap-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 px-3 py-1 text-xs text-brand-700 dark:text-brand-300 font-medium">
              جستجو: {search}
              <button onClick={() => { setSearchInput(""); updateParams({ search: null }); }}><X className="h-3 w-3" /></button>
            </div>
          )}
          {brand && (
            <div className="flex items-center gap-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 px-3 py-1 text-xs text-brand-700 dark:text-brand-300 font-medium">
              {brand}
              <button onClick={() => updateParams({ brand: null })}><X className="h-3 w-3" /></button>
            </div>
          )}
        </div>
      )}

      {/* Result count */}
      <div className="text-sm text-muted-foreground mb-5">
        {loading ? "..." : `${total.toLocaleString("fa-IR")} محصول یافت شد`}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-5">🔍</div>
          <h3 className="text-xl font-semibold mb-2">محصولی یافت نشد</h3>
          <p className="text-muted-foreground text-sm mb-6">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
          <Button variant="brand" onClick={clearFilters}>پاک کردن فیلترها</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-12">
          <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page <= 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) p = i + 1;
            else if (page <= 4) p = i + 1;
            else if (page >= totalPages - 3) p = totalPages - 6 + i;
            else p = page - 3 + i;
            return (
              <button key={p} onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-xl text-sm font-semibold transition-colors ${p === page ? "bg-brand-600 text-white shadow-md shadow-brand-600/20" : "hover:bg-accent text-muted-foreground"}`}>
                {p.toLocaleString("fa-IR")}
              </button>
            );
          })}
          <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
