# Daily Bulk Recipe Import Workflow

## Quick Setup (First Time Only)
1. Copy this into your `.gitignore`:
```
photo-map.json
recipes-bulk.json
```

## Daily Workflow (2-3 minutes per 50 recipes)

### Step 1: Upload Photos (Only New Photos)
Drop new photos into `/photos` folder, then:
```bash
node scripts/upload-photos.mjs
```
**Smart skipping**: Tracks uploaded photos in `photos-manifest.json`. Second+ runs only upload *new* photos, not all 48. Generates/updates `photo-map.json` (maps all filenames to asset IDs).

### Step 2: Create `recipes-bulk.json`
Edit `recipes-bulk.json` with your 50 recipes. Use this format:
```json
[
  {
    "title": "Recipe Name",
    "slug": "recipe-name",
    "description": "Short description",
    "cuisine": "Indian",
    "photoId": "FILENAME_WITHOUT_EXTENSION",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 4,
    "difficulty": "Easy",
    "category": "breakfast",
    "tags": ["quick"],
    "ingredients": [
      { "name": "Ingredient", "amount": "1 cup" }
    ],
    "steps": [
      { "stepNumber": 1, "instruction": "Do this" }
    ],
    "isKidFriendly": false,
    "isFeatured": false
  }
]
```

**Photo Naming:** If you upload `17870785540819829.jpg`, use `"photoId": "17870785540819829"` (no extension).

### Step 3: Bulk Import
```bash
node scripts/bulk-import-recipes.mjs
```
This creates 50 recipes as **drafts** linked to your photos.

### Step 4: Publish All
```bash
node scripts/publish-recipes.mjs
```
Recipes are now **live** on your website.

## What Gets Linked?
- Photos automatically matched by filename
- Each recipe linked to its image
- Ingredients and steps preserved
- All metadata (prep time, difficulty, tags, categories)

## Optimization Tips
- Batch 50 recipes into one JSON file
- Name photos to match your spreadsheet for easy reference
- Use category slugs: `breakfast`, `indian`, `salads`, `soups`, `global`, `snacks`
- Use difficulty: `Easy`, `Medium`, `Quick`
- Use tags: `quick`, `indian`, `kid-friendly`, `one-pot`, `gluten-free`, `dairy-free`, `high-protein`

## Files Generated
- `photos-manifest.json` — tracks uploaded photos (persistent, lets script skip already-uploaded ones)
- `photo-map.json` — created by uploader each run, includes all photos old + new (deleted before each upload check)
- `recipes-bulk.json` — your source, kept for reference (consider committing)

## Common Issues
- **"Photo not found in photo-map.json"** → Check photo filename matches `photoId` in JSON
- **Recipes created but not visible** → Run `publish-recipes.mjs` to publish drafts
- **Old recipes still showing** → ISR cache, wait 60 seconds or restart dev server
