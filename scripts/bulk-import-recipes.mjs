#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET,
  token:     process.env.SANITY_WRITE_TOKEN,
  useCdn:    false,
  apiVersion: '2024-01-01',
})

async function checkRecipeExists(slug) {
  try {
    const existing = await client.fetch('*[_type == "recipe" && slug.current == $slug][0]', { slug })
    return !!existing
  } catch {
    return false
  }
}

async function bulkCreateRecipes() {
  try {
    // Read recipes from JSON
    const rawData = readFileSync('recipes-bulk.json', 'utf-8')
    const recipes = JSON.parse(rawData)

    if (!Array.isArray(recipes)) {
      console.error('❌ recipes-bulk.json must contain an array of recipes')
      process.exit(1)
    }

    console.log(`📝 Loading ${recipes.length} recipe(ies)...\n`)

    // Load photo mapping (created by upload script)
    let photoMap = {}
    try {
      const mapData = readFileSync('photo-map.json', 'utf-8')
      photoMap = JSON.parse(mapData)
    } catch {
      console.warn('⚠ photo-map.json not found. Run upload-photos.mjs first to generate photo mappings.')
    }

    let created = 0
    let skipped = 0
    for (const recipe of recipes) {
      try {
        // Check for duplicate recipes (prevent duplicates)
        if (await checkRecipeExists(recipe.slug)) {
          console.warn(`⏭️  Skipping "${recipe.title}" — recipe with slug "${recipe.slug}" already exists`)
          skipped++
          continue
        }

        // Find asset ID for the photo
        const assetId = photoMap[recipe.photoId]
        if (!assetId) {
          console.warn(`⚠ Photo ${recipe.photoId} not found in photo-map.json. Skipping ${recipe.title}`)
          skipped++
          continue
        }

        // Build ingredient objects with _key
        const ingredients = recipe.ingredients.map((ing, i) => ({
          _key: String(i),
          ...ing,
        }))

        // Build step objects with _key
        const steps = recipe.steps.map((step, i) => ({
          _key: String(i),
          ...step,
        }))

        // Create document
        const doc = {
          _type: 'recipe',
          title: recipe.title,
          slug: { current: recipe.slug },
          description: recipe.description,
          cuisine: recipe.cuisine,
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
          },
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          category: recipe.category,
          tags: recipe.tags || [],
          ingredients,
          steps,
          isKidFriendly: recipe.isKidFriendly || false,
          isFeatured: recipe.isFeatured || false,
        }

        const result = await client.create(doc)
        console.log(`✅ ${recipe.title}`)
        created++
      } catch (err) {
        console.error(`❌ ${recipe.title} — ${err.message}`)
        skipped++
      }
    }

    console.log(`\n🎉 Created ${created}/${recipes.length} recipes. Skipped ${skipped} (duplicates or errors)`)
    if (created > 0) {
      console.log('📝 Recipes published immediately and live on site!')
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

bulkCreateRecipes()
