import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface CsvRow {
  ردیف: string;
  "شناسه محصول": string;
  "دسته/برند": string;
  "نام کامل محصول": string;
  "قیمت خرید (هزار تومان)": string;
  "قیمت اصلی (هزار تومان)": string;
  موجودی: string;
  "تاریخ ثبت قیمت": string;
  "لینک تصویر": string;
}

// Category mapping based on Persian keywords in product name
function detectCategory(name: string): string {
  const n = name.toLowerCase();

  if (n.includes("کابل")) return "کابل‌ها";
  if (n.includes("شارژر")) return "شارژرها";
  if (n.includes("پاوربانک") || n.includes("power bank") || n.includes("پاور بانک")) return "پاوربانک";
  if (n.includes("هندزفری") || n.includes("ایرفون") || n.includes("هدفون") || n.includes("هدست") || n.includes("earphone") || n.includes("airpod") || n.includes("earbud")) return "هندزفری و هدفون";
  if (n.includes("اسپیکر") || n.includes("speaker") || n.includes("بلندگو")) return "اسپیکر";
  if (n.includes("قاب") || n.includes("کاور") || n.includes("case") || n.includes("محافظ پشت") || n.includes("گارد")) return "قاب و کاور";
  if (n.includes("محافظ صفحه") || n.includes("گلس") || n.includes("glass") || n.includes("screen protector") || n.includes("محافظ گوشی")) return "محافظ صفحه";
  if (n.includes("ساعت هوشمند") || n.includes("smart watch") || n.includes("smartwatch") || n.includes("مچ بند") || n.includes("band")) return "ساعت و مچ‌بند";
  if (n.includes("هاب") || n.includes("تبدیل") || n.includes("hub") || n.includes("otg") || n.includes("آداپتور") || n.includes("adapter")) return "هاب و تبدیل";
  if (n.includes("پایه") || n.includes("نگهدارنده") || n.includes("هولدر") || n.includes("holder") || n.includes("stand") || n.includes("mount")) return "پایه و نگهدارنده";
  if (n.includes("باتری") || n.includes("battery")) return "باتری";
  if (n.includes("فلش") || n.includes("مموری") || n.includes("flash") || n.includes("memory") || n.includes("usb drive") || n.includes("ssd") || n.includes("هارد")) return "حافظه و ذخیره‌سازی";
  if (n.includes("شیلد") || n.includes("screen") || n.includes("آنتی گلر") || n.includes("privacy")) return "محافظ صفحه";

  return "لوازم جانبی";
}

function calculateSellingPrice(purchasePrice: number): number {
  let markup: number;
  if (purchasePrice < 500) markup = 1.35;
  else if (purchasePrice < 2000) markup = 1.25;
  else markup = 1.18;

  const rawPrice = purchasePrice * markup;

  if (rawPrice < 100) return Math.ceil(rawPrice / 5) * 5;
  if (rawPrice < 500) return Math.ceil(rawPrice / 10) * 10 - 1;
  if (rawPrice < 1000) return Math.ceil(rawPrice / 50) * 50 - 1;
  if (rawPrice < 5000) return Math.ceil(rawPrice / 100) * 100 - 1;
  if (rawPrice < 20000) return Math.ceil(rawPrice / 500) * 500 - 1;
  return Math.ceil(rawPrice / 1000) * 1000 - 1;
}

function generateSlug(name: string, id: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^؀-ۿa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .substring(0, 80) +
    "-" +
    id
  );
}

function parseCSV(content: string): CsvRow[] {
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^﻿/, ""));

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') { inQuotes = !inQuotes; }
        else if (line[i] === "," && !inQuotes) { values.push(current.trim()); current = ""; }
        else { current += line[i]; }
      }
      values.push(current.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ""; });
      return row as unknown as CsvRow;
    });
}

// Featured products by category — pick the best per category
const FEATURED_BY_CATEGORY: Record<string, number> = {
  "کابل‌ها": 2,
  "شارژرها": 2,
  "هندزفری و هدفون": 2,
  "اسپیکر": 1,
  "پاوربانک": 1,
  "قاب و کاور": 1,
  "هاب و تبدیل": 1,
  "ساعت و مچ‌بند": 1,
  "باتری": 1,
};

async function main() {
  console.log("🌱 Starting database seed...");

  const csvPath = path.join(
    process.env.HOME || "/Users/mani",
    "Downloads/mobile_accessories_eways_1405_03_27.csv"
  );

  if (!fs.existsSync(csvPath)) throw new Error(`CSV not found at: ${csvPath}`);

  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(content);
  console.log(`📦 Found ${rows.length} products in CSV`);

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  console.log("🗑️  Cleared existing data");

  const slugSet = new Set<string>();
  const idSet = new Set<string>();
  const products = [];
  const categoryFeaturedCount: Record<string, number> = {};

  for (const row of rows) {
    const productId = row["شناسه محصول"]?.trim();
    const name = row["نام کامل محصول"]?.trim();
    const brand = row["دسته/برند"]?.trim() || "متفرقه";
    const priceStr = row["قیمت خرید (هزار تومان)"]?.trim();
    const imageUrl = row["لینک تصویر"]?.trim();
    const stockStr = row["موجودی"]?.trim();

    if (!productId || !name || !priceStr || !imageUrl) continue;
    if (idSet.has(productId)) continue;
    if (!imageUrl.startsWith("http")) continue;

    const purchasePrice = parseFloat(priceStr);
    if (isNaN(purchasePrice) || purchasePrice <= 0) continue;

    idSet.add(productId);

    const baseSlug = generateSlug(name, productId);
    let slug = baseSlug;
    let counter = 1;
    while (slugSet.has(slug)) slug = `${baseSlug}-${counter++}`;
    slugSet.add(slug);

    const category = detectCategory(name);
    const sellingPrice = calculateSellingPrice(purchasePrice);
    const stock = parseInt(stockStr || "1000") || 1000;

    // Mark featured: first N of each priority category
    const limit = FEATURED_BY_CATEGORY[category] ?? 0;
    const currentCount = categoryFeaturedCount[category] ?? 0;
    const featured = limit > 0 && currentCount < limit;
    if (featured) categoryFeaturedCount[category] = currentCount + 1;

    products.push({ productId, name, slug, brand, category, purchasePrice, sellingPrice, imageUrl, stock, featured });
  }

  console.log(`✅ Processed ${products.length} unique products`);

  // Category stats
  const catStats: Record<string, number> = {};
  for (const p of products) catStats[p.category] = (catStats[p.category] || 0) + 1;
  console.log("📂 Categories:", Object.entries(catStats).sort((a,b) => b[1]-a[1]).map(([c,n]) => `${c}:${n}`).join(", "));
  console.log(`⭐ Featured: ${products.filter(p => p.featured).length}`);

  // Batch insert
  let inserted = 0;
  for (let i = 0; i < products.length; i += 100) {
    await prisma.product.createMany({ data: products.slice(i, i + 100) });
    inserted += Math.min(100, products.length - i);
    if (inserted % 1000 === 0 || inserted === products.length)
      console.log(`  Inserted ${inserted}/${products.length}...`);
  }

  console.log(`\n🎉 Seed complete! ${inserted} products, ${Object.keys(catStats).length} categories.`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
