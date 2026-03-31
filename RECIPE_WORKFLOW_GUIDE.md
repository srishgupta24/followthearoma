# 🌿 Safe Recipe Upload Workflow

## Overview

This workflow safely adds recipes to Follow The Aroma with built-in duplicate prevention, photo handling, and one-step publish.

## Benefits Over Manual Process

✅ **Duplicate Prevention** — Checks if recipe slug already exists before creating  
✅ **Photo Integrated** — Upload photo directly in workflow (no separate step)  
✅ **Publish Ready** — Recipe goes live immediately after creation  
✅ **Input Validation** — Guides you through all required fields  
✅ **No Orphan Drafts** — Recipes created directly as published documents  

## Quick Start

### Method 1: Interactive Guided Workflow (Recommended)

```bash
node scripts/add-recipe-safe.mjs
```

This launches an interactive prompt that walks you through:
1. Recipe details (title, slug, description, cuisine)
2. Photo upload (checks file exists, validates format)
3. Cooking info (prep time, cook time, servings, difficulty, category)
4. Ingredients (add as many as needed)
5. Steps (add cooking instructions)
6. Final confirmation before publishing

**Example Session:**
```
🌿 Follow The Aroma — Safe Recipe Workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Recipe Details

Recipe title: Chocolate Chip Cookies
Recipe slug: chocolate-chip-cookies
Short description (max 200 chars): Chewy chocolate chip cookies with brown butter and sea salt
Cuisine type (e.g., Indian, American): American
📸 Photo Upload

Full path to recipe photo: /Users/srishtigupta/Downloads/followthearoma/photos/17870785540819829.jpg
📤 Uploading 17870785540819829.jpg...
✅ Photo uploaded: image-abc123def456

⏱️  Cooking Info

Prep time (minutes): 15
Cook time (minutes): 12
Servings: 24
Difficulty (Easy/Medium/Quick) [Easy]: Medium
Category (indian/breakfast/salads/soups/global/snacks) [global]: snacks
Kid-friendly? (yes/no) [no]: yes
Featured recipe? (yes/no) [no]: no

🥘 Ingredients (enter blank line when done)

Ingredient 1 name (or press Enter to finish): Butter
Butter — amount: 1 cup, softened
Ingredient 2 name (or press Enter to finish): Brown sugar
Brown sugar — amount: 3/4 cup
...

🎉 Success! Recipe is now live.
```

### Method 2: Bulk Import (For Multiple Recipes)

Still supported! Use for batch uploads with proper duplicate checks built-in:

```bash
# Edit recipes-bulk.json with your recipes
nano recipes-bulk.json

# Upload all photos first
node scripts/upload-photos.mjs

# Import recipes (creates immediately as published)
node scripts/bulk-import-recipes.mjs
```

## File Formats

### Interactive Workflow Input
- **Photo**: Any supported format (.jpg, .jpeg, .png, .webp)
- **Slug**: URL-safe (lowercase, hyphens, no spaces)
- **Category**: indian | breakfast | salads | soups | global | snacks

### Bulk Import (recipes-bulk.json)
```json
[
  {
    "title": "Recipe Name",
    "slug": "recipe-name",
    "description": "Short description",
    "cuisine": "American",
    "photoId": "17870785540819829.jpg",
    "prepTime": 15,
    "cookTime": 12,
    "servings": 4,
    "difficulty": "Easy",
    "category": "global",
    "tags": ["quick", "vegetarian"],
    "ingredients": [
      { "name": "Item", "amount": "1 cup" }
    ],
    "steps": [
      { "stepNumber": 1, "instruction": "Step text..." }
    ],
    "isKidFriendly": true,
    "isFeatured": false
  }
]
```

## Duplicate Prevention

### How It Works
- Checks if a recipe with the same **slug** already exists
- Prevents creation if duplicate found
- Error message: `Recipe with slug "xyz" already exists!`

### If You See a Duplicate Error
1. Use a different slug (must be unique)
2. Or delete the existing recipe first, then re-import
3. Check in Sanity Studio: Content → Recipes

### Checking Current Recipes
```bash
node -e "
import('dotenv').then(({default: dotenv}) => {
  dotenv.config({path: '.env.local'})
  import('@sanity/client').then(({createClient}) => {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
      apiVersion: '2024-01-01',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false,
    })
    client.fetch('*[_type == \"recipe\"] {_id, title, slug}').then(recipes => {
      recipes.forEach(r => console.log(\`• \${r.title} (\${r.slug.current})\`))
    })
  })
})
"
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Recipe with slug already exists" | Change slug to be unique |
| "File not found" | Use absolute path to photo |
| "Unsupported image format" | Use .jpg, .jpeg, .png, or .webp |
| Recipe not appearing on site | Recipe was created; wait for Next.js to revalidate (ISR) |
| Photo didn't upload | Check .env.local has SANITY_WRITE_TOKEN |

## Next Steps After Upload

1. **Verify on site**: http://localhost:3000/recipes
2. **Check in Studio**: http://sanity.io → Content → Recipes
3. **SEO check**: Verify slug, description, and photo look good
4. **Mark as Featured** (if needed): Edit in Studio and set `isFeatured: true`

## Related Scripts

- `scripts/upload-photos.mjs` — Upload photos only
- `scripts/bulk-import-recipes.mjs` — Bulk import from JSON
- `scripts/publish-recipes.mjs` — Publish draft recipes (legacy)
- `scripts/check-recipes.mjs` — List all recipes

## Environment Setup

Make sure `.env.local` has:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your-write-token
```
