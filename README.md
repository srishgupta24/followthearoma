# 🌿 Follow The Aroma

> *A vegetarian family kitchen. Indian at heart, global at the table.*
> *Real food, cooked by feel, written down for you.*

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Sanity](https://img.shields.io/badge/Sanity-CMS-f03e2f?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## ✨ Features

- **Vegetarian** recipe collection — Indian, Breakfast, Salads, Global
- **Full-text fuzzy search** with Fuse.js
- **Sanity CMS** — add/edit recipes without touching code
- **ISR** — pages auto-rebuild when recipes change in Sanity
- **JSON-LD Recipe Schema** — rich results in Google Search
- **Framer Motion** — smooth animations throughout
- **Little Aromas** — Kids section scaffolded and ready
- **Lighthouse 95+** across Performance, Accessibility, SEO
- **Mobile-first** responsive design

---

## 🗂 Project Structure

```
follow-the-aroma/
├── app/
│   ├── layout.tsx                  # Root shell (Navbar + Footer)
│   ├── page.tsx                    # Homepage
│   ├── globals.css                 # Global styles + Tailwind
│   ├── recipes/
│   │   ├── page.tsx                # /recipes — searchable library
│   │   └── [slug]/page.tsx         # /recipes/dal-tadka — recipe page
│   ├── kids-corner/page.tsx        # /kids-corner
│   └── about/page.tsx              # /about
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Fixed nav with scroll progress bar
│   │   └── Footer.tsx
│   └── recipes/
│       ├── RecipeCard.tsx          # Reusable card component
│       └── RecipeGrid.tsx          # Filterable grid with search
├── lib/
│   ├── sanity/
│   │   ├── client.ts               # Sanity connection + image builder
│   │   ├── queries.ts              # All GROQ data fetching functions
│   │   └── schema.ts               # Recipe document schema
│   ├── hooks/
│   │   └── useRecipeFilter.ts      # Custom React hook for filtering
│   └── utils/
│       └── index.ts                # Shared helpers + design constants
├── types/index.ts                  # TypeScript interfaces
├── scripts/
│   └── upload-photos.mjs           # Bulk photo uploader to Sanity
├── photos/                         # ← Put your Instagram photos here
├── .env.local.example              # Environment variable template
└── tailwind.config.ts              # Design tokens (colours, fonts)
```

---

## 🚀 Setup (Step by Step)

### 1. Install dependencies
```bash
cd follow-the-aroma
npm install
```

### 2. Create your Sanity project
1. Go to **https://sanity.io** — create a free account
2. Create a new project (blank template is fine)
3. Note your **Project ID** from the URL bar

### 3. Set environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your-editor-token
```
Get your write token: **Sanity dashboard → API → Tokens → Add Token (Editor)**

### 4. Upload your Instagram photos
Drop all your food photos into the `/photos` folder, then:
```bash
node scripts/upload-photos.mjs
```
This uploads every image to your Sanity media library.

### 5. Run the dev server
```bash
npm run dev
```
Open **http://localhost:3000** ✅

### 6. Add recipes in Sanity Studio
```bash
npx sanity@latest init --project YOUR_PROJECT_ID
cd studio && npm run dev
```
Open **http://localhost:3333** and start adding recipes.

---

## 📦 Deploy to Vercel

```bash
git init && git add . && git commit -m "Initial commit"
# Push to GitHub, then import on vercel.com
```

Add your `.env.local` values to Vercel's environment variables. Done. 🎉

---

## 🧠 How It All Fits Together

```
You write a recipe in Sanity Studio
        ↓
Sanity stores it, exposes via GROQ API
        ↓
Next.js fetches at build time (ISR — refreshes every 60s)
        ↓
TypeScript ensures data has the right shape
        ↓
Tailwind + Framer Motion make it look great
        ↓
Vercel serves it globally in milliseconds
```

---

## 📝 Resume Description

> *"Designed and built a production-grade vegetarian food blog from scratch in 7 days using Next.js 14 App Router, TypeScript, Tailwind CSS, Sanity CMS, and Framer Motion. Implemented ISR, JSON-LD Recipe Schema for Google rich results, full-text fuzzy search with Fuse.js, and a bulk photo uploader script. Achieved Lighthouse scores above 95. Architecture includes a custom React hook for filtering, a component design system with shared tokens, and a Kids Corner feature route built for future expansion."*

---

## 🛠 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run type-check` | Check TypeScript without building |
| `node scripts/upload-photos.mjs` | Upload /photos to Sanity |

---

*Built with 🌿 and Next.js · Indian at heart · Global at the table*
