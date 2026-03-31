Great mindset — understanding your own code inside out is what makes the difference in interviews. Let's build this up like floors of a building, plain language all the way.

🏠 First, The Big Picture
Imagine your food blog is a restaurant.
CUSTOMER         = Someone visiting followthearoma.com
WAITER           = Next.js (takes orders, brings food)
KITCHEN          = Your server (where food is prepared)
RECIPE BOOK      = Sanity CMS (where all recipes are stored)
INTERIOR DESIGN  = Tailwind CSS (how everything looks)
SMOOTH GESTURES  = Framer Motion (animations)
MENU SEARCH      = Fuse.js (finding dishes quickly)
THE BUILDING     = Vercel (hosts everything, open 24/7)
Everything we built is just these pieces talking to each other.

🧱 Floor 1 — The Foundation Files
package.json — The Shopping List
json{
  "name": "follow-the-aroma",
  "dependencies": {
    "next": "14.2.5",
    "framer-motion": "^11.3.0"
  }
}
```

**Plain language:** Before you can cook, you need ingredients. Before your app can run, it needs software packages. `package.json` is literally a shopping list. When you run `npm install`, npm reads this list and downloads everything.

The difference between `dependencies` and `devDependencies`:
```
dependencies    = needed when the site is LIVE (Next.js, Tailwind)
devDependencies = only needed while you're BUILDING (TypeScript checker, ESLint)

tsconfig.json — The Grammar Rules
json{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
Plain language: TypeScript is JavaScript with grammar rules. tsconfig.json sets those rules. The most important line is "@/*": ["./*"] — this is why you can write:
tsimport { RecipeCard } from '@/components/recipes/RecipeCard'
// instead of:
import { RecipeCard } from '../../../components/recipes/RecipeCard'
The @ is a shortcut that always means "start from the project root." No more counting ../ dots.

tailwind.config.ts — Your Design Bible
tscolors: {
  'spice':     '#c8440f',
  'ink':       '#1a1612',
  'parchment': '#faf6f0',
}
Plain language: Without this, you'd write CSS like:
csscolor: #c8440f;       /* what colour is this? */
With this, you write:
html<div className="text-spice">  <!-- obviously the spice red -->
```

You define colours ONCE here. Use them everywhere. Change your brand colour? Change one line. Done. That's called a **design token system** and it's how professional design teams work.

---

## 🏗️ Floor 2 — How Next.js Works

This is the most important concept to understand.

### The Old Way vs The Next.js Way

**Old way (plain React):**
```
User visits page
→ Browser downloads empty HTML
→ Browser downloads huge JavaScript file
→ JavaScript runs, fetches data from API
→ Page finally shows content
= SLOW. Bad for Google. User sees blank page.
```

**Next.js way:**
```
User visits page
→ Server already has the HTML ready (pre-built)
→ Browser receives full page immediately
→ Page shows content instantly
= FAST. Google loves it. User sees content immediately.
The Three Strategies — Real Examples From Your Site
Strategy 1: SSG — Static Site Generation
Your recipe pages like /recipes/banana-oat-pancakes — these are built ONCE when you deploy. Like printing a book before the library opens.
ts// app/recipes/[slug]/page.tsx
export async function generateStaticParams() {
  const recipes = await getAllRecipes()
  return recipes.map(r => ({ slug: r.slug.current }))
}
Plain language: At build time, Next.js asks "give me every recipe slug" and pre-builds a page for each one. When a user visits, the page is already made — instant.

Strategy 2: ISR — Incremental Static Regeneration
tsexport const revalidate = 60
Plain language: This one line is magic. It means:

The page is pre-built (fast like SSG)
But every 60 seconds, if someone visits, Next.js quietly rebuilds it in the background
So when you publish a new recipe in Sanity at 2pm, by 2:01pm it's live on your site

No redeploy. No developer involvement. Just content publishing.
Think of it like a newspaper. The morning edition is printed (static). But there's a rolling update that quietly replaces pages with new information without stopping the presses.

Strategy 3: CSR — Client Side Rendering
Your recipe filter and search. This runs in the browser because it needs to react to what the user is typing.
ts// RecipeGrid.tsx
'use client'
const [searchQuery, setSearchQuery] = useState('')
```

**Plain language:** The `'use client'` at the top tells Next.js — "this component needs to run in the browser." Everything else on your site runs on the server. Only this small piece ships JavaScript to the browser.

---

### The [slug] Folder — Dynamic Routing
```
app/
  recipes/
    [slug]/
      page.tsx
```

**Plain language:** The square brackets mean "wildcard." It's like a template. One file handles infinite URLs:
```
/recipes/banana-oat-pancakes   → slug = "banana-oat-pancakes"
/recipes/dal-tadka             → slug = "dal-tadka"
/recipes/masala-pasta          → slug = "masala-pasta"
```

Next.js sees the URL, extracts the slug, and passes it to your page as a prop. Your page then uses that slug to fetch the right recipe from Sanity.

---

## 🗄️ Floor 3 — Sanity CMS

### What Sanity Actually Is

You know how Google Docs stores your documents separately from where you read them? Sanity is the same idea for your recipes.
```
Traditional blog:   Content + Website = ONE thing (WordPress)
Your blog:          Content (Sanity) + Website (Next.js) = TWO separate things
The second approach is called headless CMS. "Headless" means the content has no face of its own — it just provides data. Your Next.js site is the face.
Why this is better:

You could build a mobile app tomorrow that uses the same recipes
If Next.js gets replaced by something better in 5 years, your content stays
Non-technical people (future you) can add recipes without touching code


lib/sanity/client.ts — The Phone Line
tsexport const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   'production',
  apiVersion: '2024-01-01',
})
Plain language: This is just setting up a phone connection to Sanity. projectId is like Sanity's phone number. apiVersion is like specifying which version of the phone book — Sanity freezes their API on a date so your code never breaks when they update.
The process.env. part means "read this value from a secret file on my computer" — so you never hardcode sensitive values in your code.

lib/sanity/queries.ts — GROQ Language
tsconst ALL_RECIPES_QUERY = `
  *[_type == "recipe"] | order(_createdAt desc) {
    title, slug, description, prepTime
  }
`
```

**Plain language:** GROQ is Sanity's way of asking questions. Read it like English:
```
*                          = "Look at everything"
[_type == "recipe"]        = "where the type is recipe"
| order(_createdAt desc)   = "sorted newest first"
{ title, slug, description } = "but only give me these fields"
The last part is important — you're only fetching what you need. If a recipe has 20 fields, asking for 4 means the response is 80% smaller. Faster. This is called field projection and it's a sign of thoughtful API design.

lib/sanity/schema.ts — The Form Builder
tsdefineField({
  name:  'title',
  type:  'string',
  validation: r => r.required().min(5).max(80)
})
```

**Plain language:** This file tells Sanity "here's what a recipe looks like." Sanity reads it and automatically builds the editing form in Studio. You write the rules once in code — Sanity generates the UI.

The validation is like form validation but server-side:
```
r.required()    = can't publish without a title
r.min(5)        = must be at least 5 characters
r.max(80)       = can't be longer than 80 characters

⚛️ Floor 4 — React Concepts Used
Props — Passing Information Down
ts// Parent passes data:
<RecipeCard recipe={recipe} index={i} priority={true} />

// Child receives it:
function RecipeCard({ recipe, index, priority }: RecipeCardProps) {
  return <div>{recipe.title}</div>
}
Plain language: Props are like filling out an order form. The parent (RecipeGrid) fills in what it wants. The child (RecipeCard) reads the form and acts on it. Data always flows DOWN — parent to child, never the other way.

useState — Component Memory
tsconst [searchQuery, setSearchQuery] = useState('')
```

**Plain language:** React components don't remember anything by default — they reset every render. `useState` gives them memory.
```
useState('')              = "Start with an empty string"
searchQuery               = "The current value — read this"
setSearchQuery('dal')     = "Change the value — triggers a re-render"
When you call setSearchQuery, React re-renders the component with the new value. That's how typing in the search box updates the results live.

useEffect — Do Something After Rendering
ts// In Navbar.tsx
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 50)
  window.addEventListener('scroll', onScroll)
  return () => window.removeEventListener('scroll', onScroll)
}, [])
```

**Plain language:** useEffect says "after the component appears on screen, do this."
```
The function inside   = what to do (add scroll listener)
The return function   = cleanup (remove listener when component leaves)
The [] at the end     = only run this once, when first mounted
Without the cleanup return, you'd add a new scroll listener every time the Navbar re-renders — a memory leak.

useMemo — Don't Repeat Work
ts// In useRecipeFilter.ts
const filtered = useMemo(() => {
  return recipes.filter(r => r.category === activeCategory)
}, [recipes, activeCategory])
Plain language: Filtering 100 recipes is fast, but doing it on EVERY single render (even when nothing changed) is wasteful. useMemo caches the result and only recalculates when recipes or activeCategory actually changes.
Think of it like a calculator that remembers its last answer. If you ask "what's 847 × 23" twice, it only calculates once.

Custom Hook — Bundled Logic
ts// lib/hooks/useRecipeFilter.ts
export function useRecipeFilter(recipes: Recipe[]) {
  const [activeCategory, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const filtered = useMemo(() => { ... }, [...])
  return { filtered, activeCategory, setCategory, searchQuery, setSearchQuery }
}
Plain language: A custom hook is just a function that uses other hooks. Instead of writing all this filtering logic inside RecipeGrid (making it huge and messy), you pull it out into its own file and just call it:
ts// In RecipeGrid.tsx — clean and simple
const { filtered, setCategory } = useRecipeFilter(recipes)
It's the same as extracting a complex calculation into a helper function. Separation of concerns.

🎨 Floor 5 — Tailwind CSS
How Classes Map to CSS
html<div className="bg-parchment px-8 py-4 rounded-full text-spice font-semibold">
```

**Plain language, one by one:**
```
bg-parchment    = background-color: #faf6f0
px-8            = padding-left: 2rem; padding-right: 2rem
py-4            = padding-top: 1rem; padding-bottom: 1rem
rounded-full    = border-radius: 9999px (pill shape)
text-spice      = color: #c8440f
font-semibold   = font-weight: 600
Responsive Classes
html<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

**Plain language:**
```
grid-cols-1           = 1 column (mobile)
md:grid-cols-2        = 2 columns when screen ≥ 768px (tablet)
lg:grid-cols-3        = 3 columns when screen ≥ 1024px (desktop)
The prefix before : is the breakpoint. No media queries to write. No separate CSS file. The responsiveness is right there on the element.

🎭 Floor 6 — Framer Motion
Basic Animation
tsx<MotionDiv
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

**Plain language:**
```
initial     = "Start like this" (invisible, 20px below)
animate     = "End like this"   (fully visible, normal position)
transition  = "Take 0.4 seconds to get there"
Framer Motion smoothly interpolates between those two states. That's the card fade-up animation you see.
The Client Manifest Error — Why It Happened
ts// This caused the error ❌
// app/page.tsx (Server Component)
import { motion } from 'framer-motion'

// This fixed it ✅
// components/ui/Motion.tsx
'use client'
export const MotionDiv = motion.div
```

**Plain language:** Framer Motion needs the browser to animate things (it measures elements, tracks mouse position etc). Server Components run on the server — there's no browser there. When Next.js tried to bundle Framer Motion for the server, it couldn't find it because it was never meant to be there.

The fix creates a clear door between server and client:
```
Server Component → imports MotionDiv from Motion.tsx
                              ↓
                    Motion.tsx says 'use client'
                              ↓
                    Next.js: "OK, everything from here runs in browser"
                              ↓
                    Framer Motion: "Great, that's where I live"

🔍 Floor 7 — Fuse.js Search
tsconst fuse = new Fuse(recipes, {
  keys:      [{ name: 'title', weight: 0.7 }],
  threshold: 0.35,
})
const results = fuse.search('bannana')  // still finds "Banana Oat Pancakes"
```

**Plain language:** Normal search is exact — "banana" finds "banana", nothing else. Fuzzy search forgives mistakes.
```
threshold: 0     = must be perfect match
threshold: 0.35  = allows small differences (typos, missing letters)
threshold: 1     = matches almost anything (useless)

weight: 0.7      = title matches are more important than description matches
```

Fuse downloads all your recipes once when the page loads, then searches entirely in the browser. No server request on every keystroke. That's why it feels instant.

---

## 🚀 Floor 8 — The Deployment Pipeline
```
You write code
     ↓
git push to GitHub
     ↓
Vercel detects the push automatically
     ↓
Vercel runs: npm run build
     ↓
Next.js pre-renders all static pages (SSG)
     ↓
Site is live, globally distributed
     ↓
You publish a recipe in Sanity
     ↓
ISR quietly rebuilds affected pages in background
     ↓
New recipe is live within 60 seconds
Plain language: After the initial setup, you never manually deploy again. Push code → it's live. Publish recipe → it's live. That's CI/CD (Continuous Integration / Continuous Deployment) at its simplest.

🎯 The One Mental Model To Remember
If someone asks you to explain the whole project in 30 seconds:

"It's split into two halves. The content half lives in Sanity — that's where recipes are written and photos are managed. The display half is a Next.js site that pulls from Sanity. Most pages are pre-built at deploy time for speed and SEO, with ISR keeping them fresh when new recipes are added. The only JavaScript that runs in the browser is for the search filter and animations — everything else is pure HTML from the server. TypeScript makes sure the data shape is consistent from the database all the way to the UI component."

