# ایوِیز موبایل — Mobile Accessories E-Commerce

A premium, production-ready mobile accessories store built with Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, and Prisma. The product catalog is sourced directly from the provided CSV file (4,864 products).

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **State**: Zustand (persistent cart)
- **Database**: PostgreSQL + Prisma ORM
- **Forms**: React Hook Form + Zod validation
- **Email**: Nodemailer

---

## Features

- 🛍️ Full e-commerce flow: browse → detail → cart → checkout
- 🔍 Search, filter by brand, sort products
- 📦 4,864 real products from CSV with auto-generated selling prices
- 📧 Order email notification to admin via Nodemailer
- 🌙 Dark / Light mode
- 📱 Mobile-first responsive design
- ⚡ Framer Motion animations throughout
- 🗺️ SEO: sitemap, robots.txt, Open Graph, dynamic metadata

---

## Pricing Rules

| Purchase Price (×1000 Toman) | Markup |
|---|---|
| < 500k | +35% |
| 500k – 2M | +25% |
| > 2M | +18% |

Prices are rounded to psychologically attractive retail values.

---

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+ (running locally)

### 2. Clone & Install

```bash
cd mobile-store
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL connection
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/mobile_store"

# Gmail SMTP (use an App Password, not your main password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
ADMIN_EMAIL="mani.nani.13.83@gmail.com"

# App URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Create the database
createdb mobile_store

# Push schema
npm run db:push

# Seed all 4,864 products from CSV
npm run db:seed
```

> The seed script reads the CSV from `~/Downloads/mobile_accessories_eways_1405_03_27.csv`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Gmail Setup for Email Orders

1. Enable 2-Factor Authentication on your Google account
2. Go to: Google Account → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Use that 16-character password as `SMTP_PASS` in `.env`

---

## Production Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page (SSR)
│   ├── products/
│   │   ├── page.tsx          # Products listing (client)
│   │   └── [slug]/page.tsx   # Product detail (SSR)
│   ├── cart/page.tsx         # Shopping cart (client)
│   ├── checkout/page.tsx     # Checkout form (client)
│   ├── api/
│   │   ├── products/route.ts # GET products (filtered/paginated)
│   │   ├── products/[slug]/  # GET single product + related
│   │   ├── orders/route.ts   # POST create order + send email
│   │   ├── brands/route.ts   # GET all brands with counts
│   │   └── newsletter/route.ts # POST subscribe
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # robots.txt
├── components/
│   ├── layout/navbar.tsx     # Sticky nav with search + cart badge
│   ├── layout/footer.tsx
│   ├── home/                 # Hero, brands, benefits, newsletter
│   ├── products/             # ProductCard, product list client, detail
│   ├── cart/                 # Cart with quantity controls
│   └── checkout/             # Checkout form + success state
├── lib/
│   ├── prisma.ts             # Prisma singleton
│   ├── email.ts              # Nodemailer order email template
│   └── utils.ts              # formatPrice, cn, slugify...
├── store/cart.ts             # Zustand cart (persisted to localStorage)
└── types/index.ts            # TypeScript interfaces
```

---

## Database Schema

```prisma
model Product {
  id            String   @id
  productId     String   @unique   # Original CSV product ID
  name          String             # Full Persian product name
  slug          String   @unique   # URL-safe slug
  brand         String             # Brand / category from CSV
  purchasePrice Float              # Original purchase price (×1000 Toman)
  sellingPrice  Float              # Auto-calculated selling price
  imageUrl      String             # CDN image URL from eways.co
  stock         Int
  featured      Boolean
}

model Order {
  id          String      @id
  firstName   String
  lastName    String
  phone       String
  address     String
  notes       String?
  totalAmount Float
  status      OrderStatus
  items       OrderItem[]
}
```

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel Dashboard → Project Settings → Environment Variables.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## License

MIT
